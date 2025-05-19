import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useLanguagesContext } from '../../context/languagesContext/languagesContext';

const RechartsPieChart = ({ data, user }) => {
  const { language } = useLanguagesContext();

  // Datos del gráfico
  const chartData = [
    { name: language.win, value: data === 'fast' ? user.gamesWonFast : data === 'blitz' ? user.gamesWonBlitz : user.gamesWonBullet },
    { name: language.lost, value: data === 'fast' ? user.gamesLostFast : data === 'blitz' ? user.gamesLostBlitz : user.gamesLostBullet },
    { name: language.draw, value: data === 'fast' ? user.gamesTiedFast : data === 'blitz' ? user.gamesTiedBlitz : user.gamesTiedBullet },
  ];

  // Colores del gráfico
  const COLORS = ['#80de83', '#E74C3C', '#ABB2B9'];

  return (
    <PieChart width={270} height={170}>
      <Pie
        data={chartData}
        cx="40%"
        cy="50%"
        labelLine={false}
        outerRadius={60}
        fill="#8884d8"
        dataKey="value"
      >
        {chartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default RechartsPieChart;
