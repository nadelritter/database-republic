import Image from "next/image";

interface Stock {
  Name: string;
  ISIN: string;
  date: string;
}

interface StockCardProps {
  stock: Stock;
  type: "added" | "removed";
}

const StockCard = ({ stock, type }: StockCardProps) => {
  const companyNameForLogo = stock.Name.split(" ")[0].toLowerCase().replace(/[^a-z0-9]/gi, '');
  // This line is now fixed with backticks ``
  const logoUrl = `https://logo.clearbit.com/${companyNameForLogo}.com`;

  return (
    <div className="flex items-center gap-4 p-3 bg-[#1e1e1e] rounded-md border border-transparent hover:border-gray-600 transition-colors">
      <Image
        src={logoUrl}
        alt={`${stock.Name} logo`}
        width={40}
        height={40}
        className="rounded-full bg-gray-700 object-contain"
        onError={(e) => {
          e.currentTarget.src = "/database-logo.png";
        }}
      />
      <div className="overflow-hidden">
        <p className="font-semibold truncate" title={stock.Name}>
          {stock.Name}
        </p>
        <p className="text-sm text-gray-400">
          {type === "added" ? "Added" : "Removed"}: {stock.date}
        </p>
      </div>
    </div>
  );
};

export default StockCard;