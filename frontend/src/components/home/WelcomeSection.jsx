import SearchBar from "../common/SearchBar";

import character from "../../assets/illustrations/character-tb.png";

function WelcomeSection() {
  return (
    <section className="w-full px-10 py-8">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-8">

        {/* Character + Text */}
        <div className="flex items-center gap-4">

          <img
            src={character}
            alt="TemanBelanja"
            className="w-[95px] shrink-0 object-contain"
          />

          <div>
            <h1 className="text-2xl font-semibold text-tb-black-primary">
              Selamat Datang di
              <span className="text-tb-red-primary">
                {" "}TemanBelanja
              </span>
            </h1>

            <p className="mt-1 text-sm font-normal text-tb-black-primary">
              Siap menjadi{" "}
              <span className="font-medium text-tb-red-primary">
                TemanBelanja
              </span>{" "}
              mu! Anda {" "}
              <span className="font-medium text-tb-red-primary">
                puas
              </span>{" "}
              Kami{" "}
              <span className="font-medium text-tb-red-primary">
                senang
              </span>
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="w-[255px] shrink-0">
          <SearchBar />
        </div>

      </div>
    </section>
  );
}

export default WelcomeSection;