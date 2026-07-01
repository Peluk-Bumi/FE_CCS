import { FiMail, FiPhone, FiMapPin, FiInstagram } from "react-icons/fi";

export const footerContactItems = [
  {
    id: "instagram",
    label: "@pelukbumi.community",
    href: "https://instagram.com/pelukbumi.community",
    icon: FiInstagram,
    target: "_blank",
  },
  {
    id: "email",
    label: "pelukbumi.community@gmail.com",
    href: "mailto:pelukbumi.community@gmail.com",
    icon: FiMail,
  },
  {
    id: "whatsapp",
    label: "+62 821 024 1565",
    href: "https://wa.me/628210241565?text=Halo%20Peluk%20Bumi,%20saya%20ingin%20bertanya%20terkait%20program%20dan%20kolaborasi.",
    icon: FiPhone,
    target: "_blank",
  },
  {
    id: "maps",
    label: "Komplek Guruminda, Jl. Purba Kencana No.28 Blok A, Cisaranten Kulon, Kec. Arcamanik, Kota Bandung, Jawa Barat 40273",
    href: "https://maps.app.goo.gl/Tqh5drnH91jDVf4E7",
    icon: FiMapPin,
    target: "_blank",
  },
];
