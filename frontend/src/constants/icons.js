import { 
  FaUtensils, 
  FaCar, 
  FaShoppingBag, 
  FaFilm, 
  FaFileInvoiceDollar,
  FaHeartbeat,
  FaGraduationCap,
  FaSpa,
  FaEllipsisH,
  FaMoneyBillWave,
  FaBriefcase,
  FaChartLine,
  FaGift
} from 'react-icons/fa';

export const getCategoryIcon = (category) => {
  const iconMap = {
    'Food & Dining': FaUtensils,
    'Transportation': FaCar,
    'Shopping': FaShoppingBag,
    'Entertainment': FaFilm,
    'Bills & Utilities': FaFileInvoiceDollar,
    'Healthcare': FaHeartbeat,
    'Education': FaGraduationCap,
    'Personal Care': FaSpa,
    'Salary': FaMoneyBillWave,
    'Freelance': FaBriefcase,
    'Business': FaBriefcase,
    'Investment': FaChartLine,
    'Gift': FaGift,
    'Other': FaEllipsisH,
  };
  
  return iconMap[category] || FaEllipsisH;
};
