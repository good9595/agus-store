import { PrismaClient } from "@prisma/client";
import { withApiKey } from '../../../utils/withApiKey'

const prisma = new PrismaClient();

async function handle(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
      include: { products: true },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json(category);
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

export default withApiKey(handle)
