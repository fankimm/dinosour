import { NextApiRequest } from 'next';

export default (req: NextApiRequest, res: any) => {
  const {
    name, message, type,
  } = JSON.parse(req.body);

  const body = {
    name,
    message,
    type,
  };

  // dispatch to channel "message"
  res?.socket?.server?.io?.emit('message', body);

  // return message
  res.status(201).json(body);
};
