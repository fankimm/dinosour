import { NextApiRequest, NextApiResponse } from 'next';

const getColor = (_req:NextApiRequest, res:NextApiResponse) => {
  let color = '';
  for (let i = 0; i < 3; i += 1) {
    if (i !== 2) {
      color += `${Math.floor(Math.random() * 256).toString()},`;
    } else {
      color += Math.floor(Math.random() * 256).toString();
    }
  }
  res.status(200).json({ color });
};

export default getColor;
