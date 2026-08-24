import "./globals.css";

export const metadata = {
  title: "PRIME — 40歳からの代謝設計コーチング",
  description:
    "アナボリック抵抗性や脳の省エネモードなど、40代以降の身体の仕組みに特化した科学的コーチングアプリ。睡眠連動の筋肉保護、強制順序トレーニング、スポーツ連動を設計に統合します。",
  openGraph: {
    title: "PRIME — 40歳からの代謝設計コーチング",
    description:
      "40代以降の身体の防衛本能を、根性ではなく設計でコントロールする伴走型コーチングアプリ。",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
