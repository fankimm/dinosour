import { NextApiRequest } from 'next';
import moment from 'moment';

export default (req: NextApiRequest, res: any) => {
  if (req.method === 'POST') {
    // get message
    const time = moment().format('LT');
    const {
      name, message, color, id,
    } = JSON.parse(req.body);

    const body = {
      id,
      name,
      message,
      time,
      color,
    };

    // dispatch to channel "message"
    res?.socket?.server?.io?.emit('message', body);

    // return message
    res.status(201).json(body);
  }
};
