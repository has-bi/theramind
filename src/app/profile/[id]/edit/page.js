import { FormUpdate } from "@/app/_components/form-update";
import { prisma } from "@/utils/prisma";

export default async function EditPage(params) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  return (
    <FormUpdate
      id={user.id}
      firstName={user.firstName}
      lastName={user.lastName}
      email={user.email}
      password={user.password}
    />
  );
}
