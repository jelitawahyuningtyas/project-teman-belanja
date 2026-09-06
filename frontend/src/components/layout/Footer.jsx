import {
  MapPin,
  Heart,
  Mail,
  Phone,
  Copyright,
} from "lucide-react";

function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-tb-white-primary px-12 py-8">
      <h2 className="mb-8 text-center text-xl font-medium text-tb-black-primary">
        Solusi{" "}
        <span className="text-tb-red-primary">Praktis</span>{" "}
        Menjadi{" "}
        <span className="text-tb-red-primary">TemanBelanja</span> Mu
      </h2>

      <div className="mb-8 flex items-center justify-center gap-7">
        <div className="flex items-center gap-2 bg-tb-yellow-primary px-3 py-2 text-sm">
          <MapPin size={22} className="text-tb-red-primary" />
          <span>
            Jl. Cempaka Putih Barat
            <br />
            Jakarta Pusat
          </span>
        </div>

        <div className="flex items-center gap-2 bg-tb-yellow-primary px-3 py-3 text-sm">
          <Heart size={22} className="text-tb-red-primary" />
          <span>@temanbelanja</span>
        </div>

        <div className="flex items-center gap-2 bg-tb-yellow-primary px-3 py-3 text-sm">
          <Mail size={22} className="text-tb-red-primary" />
          <span>temanbelanja@gmail.com</span>
        </div>

        <div className="flex items-center gap-2 bg-tb-yellow-primary px-3 py-3 text-sm">
          <Phone size={22} className="text-tb-red-primary" />
          <span>081234567899</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm">
        <Copyright size={22} className="text-tb-red-primary" />
        <span>2026. All Right Reserved.</span>
      </div>
    </footer>
  );
}

export default Footer;