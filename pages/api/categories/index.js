import { PrismaClient } from "@prisma/client";
import { withApiKey } from '../../../utils/withApiKey'

const prisma = new PrismaClient();

async function handle(req, res) {
  if (req.method === "GET") {
    const categories = await prisma.category.findMany({
      include: { products: true },
    });

    return res.status(200).json(categories);
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

export default withApiKey(handle)
