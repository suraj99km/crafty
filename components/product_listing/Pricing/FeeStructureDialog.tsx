import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InfoIcon } from "lucide-react";

// Fee structure data
const feeStructure = [
  { min: 0, max: 99, percentage: 20 },
  { min: 100, max: 199, percentage: 19 },
  { min: 200, max: 299, percentage: 18 },
  { min: 300, max: 399, percentage: 17 },
  { min: 400, max: 499, percentage: 16 },
  { min: 500, max: 699, percentage: 15 },
  { min: 700, max: 999, percentage: 14 },
  { min: 1000, max: 1249, percentage: 12 },
  { min: 1250, max: 1499, percentage: 11 },
  { min: 1500, max: 1999, percentage: 10 },
  { min: 2000, max: 2499, percentage: 9 },
  { min: 2500, max: 2999, percentage: 8 },
  { min: 3000, max: 3999, percentage: 6 },
  { min: 4000, max: 5000, percentage: 5 }
];

interface FeeStructureDialogProps {
  currentPrice: number;
}

const FeeStructureDialog: React.FC<FeeStructureDialogProps> = ({ currentPrice }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="ml-2 text-gray-400 hover:text-gray-600">
          <InfoIcon className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle className="text-center mb-4">Platform Fee Structure</DialogTitle>
        </DialogHeader>
        <div className="overflow-auto max-h-96">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Artist's Price (₹)</th>
                <th className="p-2 text-left">Platform Fee (%)</th>
              </tr>
            </thead>
            <tbody>
              {feeStructure.map((tier, index) => (
                <tr key={index} className={
                  currentPrice >= tier.min && currentPrice <= tier.max 
                    ? "bg-red-100" 
                    : index % 2 === 0 ? "bg-gray-50" : ""
                }>
                  <td className="p-2 border-t border-gray-200">
                    {tier.min === 0 ? "Below 100" : `${tier.min} - ${tier.max}`}
                  </td>
                  <td className="flex-center p-2 border-t border-gray-200">{tier.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeeStructureDialog;
export { feeStructure };