import "dotenv/config";
import pg from "pg";

const { Client } = pg;

const localClient = new Client({
  connectionString:
    process.env.LOCAL_DATABASE_URL,
});

const productionClient = new Client({
  connectionString:
    process.env.DIRECT_URL,
});

// ==================================================
// TABLE ORDER
// CHILD TABLE → PARENT TABLE
// ==================================================

const tables = [
  "User",
  "Category",
  "Product",
  "Address",
  "Order",
  "OrderItem",
  "Payment",
  "Notification",
];

// ==================================================
// ESCAPE IDENTIFIER
// ==================================================

function quoteIdentifier(identifier) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

// ==================================================
// MAIN
// ==================================================

async function main() {
  try {
    console.log(
      "Menghubungkan ke database lokal..."
    );

    await localClient.connect();

    console.log(
      "Menghubungkan ke Prisma Postgres..."
    );

    await productionClient.connect();

    console.log(
      "Koneksi kedua database berhasil."
    );

    // ==================================================
    // CEK DATABASE
    // ==================================================

    const localInfo =
      await localClient.query(
        `
        SELECT current_database() AS database
        `
      );

    const productionInfo =
      await productionClient.query(
        `
        SELECT current_database() AS database
        `
      );

    console.log(
      "Local database:",
      localInfo.rows[0].database
    );

    console.log(
      "Production database:",
      productionInfo.rows[0].database
    );

    // ==================================================
    // CEK PRODUCTION KOSONG
    // ==================================================

    let productionHasData = false;

    for (const table of tables) {
      const result =
        await productionClient.query(
          `SELECT COUNT(*)::int AS count FROM ${quoteIdentifier(
            table
          )}`
        );

      const count =
        result.rows[0].count;

      if (count > 0) {
        productionHasData = true;

        console.log(
          `Production ${table}: ${count} row`
        );
      }
    }

    if (productionHasData) {
      throw new Error(
        "Database production tidak kosong. Copy dibatalkan agar data tidak tertimpa."
      );
    }

    // ==================================================
    // BEGIN TRANSACTION
    // ==================================================

    await productionClient.query(
      "BEGIN"
    );

    // ==================================================
    // COPY DATA
    // ==================================================

    for (const table of tables) {
      console.log(
        `\nMenyalin tabel ${table}...`
      );

      const result =
        await localClient.query(
          `SELECT * FROM ${quoteIdentifier(
            table
          )}`
        );

      if (result.rows.length === 0) {
        console.log(
          `${table}: tidak ada data`
        );

        continue;
      }

      const columns =
        result.fields.map(
          (field) =>
            field.name
        );

      const quotedColumns =
        columns
          .map(quoteIdentifier)
          .join(", ");

      for (const row of result.rows) {
        const values =
          columns.map(
            (column) =>
              row[column]
          );

        const placeholders =
          values
            .map(
              (_, index) =>
                `$${index + 1}`
            )
            .join(", ");

        await productionClient.query(
          `
          INSERT INTO ${quoteIdentifier(
            table
          )}
          (${quotedColumns})
          VALUES (${placeholders})
          `,
          values
        );
      }

      console.log(
        `${table}: ${result.rows.length} row berhasil disalin`
      );
    }

    // ==================================================
// RESET SEQUENCES
// ==================================================

console.log(
  "\nMenyesuaikan sequence..."
);

const sequenceQueries = [
  {
    table: "User",
    column: "id",
  },
  {
    table: "Category",
    column: "id",
  },
  {
    table: "Product",
    column: "id",
  },
  {
    table: "Address",
    column: "id",
  },
  {
    table: "OrderItem",
    column: "id",
  },
  {
    table: "Payment",
    column: "id",
  },
  {
    table: "Notification",
    column: "id",
  },
];

for (const item of sequenceQueries) {
  const tableName =
    quoteIdentifier(item.table);

  const columnName =
    quoteIdentifier(item.column);

  const sequenceResult =
    await productionClient.query(
      `
      SELECT pg_get_serial_sequence(
        $1,
        $2
      ) AS sequence
      `,
      [
        tableName,
        item.column,
      ]
    );

  const sequence =
    sequenceResult.rows[0]
      .sequence;

  if (!sequence) {
    console.log(
      `${item.table}: sequence tidak ditemukan`
    );

    continue;
  }

  await productionClient.query(
    `
    SELECT setval(
      $1::regclass,
      COALESCE(
        (
          SELECT MAX(${columnName})
          FROM ${tableName}
        ),
        1
      ),
      true
    )
    `,
    [sequence]
  );

  console.log(
    `${item.table}: sequence berhasil disesuaikan`
  );
}

    // ==================================================
    // COMMIT
    // ==================================================

    await productionClient.query(
      "COMMIT"
    );

    console.log(
      "\n================================"
    );

    console.log(
      "DATABASE BERHASIL DIPINDAHKAN ✅"
    );

    console.log(
      "================================"
    );
  } catch (error) {
    console.error(
      "\nCOPY DATABASE GAGAL ❌"
    );

    console.error(
      error.message
    );

    try {
      await productionClient.query(
        "ROLLBACK"
      );
    } catch {
      // Ignore rollback error
    }

    process.exitCode = 1;
  } finally {
    await localClient.end();
    await productionClient.end();
  }
}

main();