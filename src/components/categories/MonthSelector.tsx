'use client'

import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth } from 'date-fns';

interface MonthSelectorProps {
  onMonthChange: (startDate: Date, endDate: Date) => void;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({ onMonthChange }) => {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMonth = event.target.value;
    setSelectedMonth(newMonth);
    const startDate = startOfMonth(new Date(newMonth));
    const endDate = endOfMonth(new Date(newMonth));
    onMonthChange(startDate, endDate);
  };

  return (
    <input
      type="month"
      value={selectedMonth}
      onChange={handleChange}
    />
  );
};

export default MonthSelector;
