import ProfileForm from "@/components/profile/profile-form";
import { editUser } from "@/lib/actions";
import { authOptions } from "@/lib/auth-options";
import { getUser } from "@/lib/data";
import { getServerSession } from "next-auth";
import Form from "next/form";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const userProfile = await getUser(session?.user.address!);
  const { name, bio, links, tags, avatar } = userProfile?.info;

  async function updateProfile(formData: FormData) {
    "use server";
    try {
      const links = formData
        .getAll("links")
        .map((link) => JSON.parse(link.toString()));
      const tags = formData.getAll("tags").map((tag) => tag.toString());
      const userInfo: UserInfo = {
        name: formData.get("name")?.toString(),
        bio: formData.get("bio")?.toString(),
        links,
        tags,
        email: formData.get("email")?.toString(),
      };
      console.log(userInfo);
      await editUser(session?.user.address!, userInfo);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h1>profile</h1>
      <Form action={updateProfile}>
        <ProfileForm
          updateProfile={updateProfile}
          name={name}
          bio={bio}
          links={links}
          tags={tags}
          avatar={avatar}
        />
      </Form>
    </div>
  );
}
