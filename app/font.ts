import { Bricolage_Grotesque, Fredoka, Pacifico } from "next/font/google";

export const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
});




export const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
