import Heading from "@/components/layout/heading";
import ProfileForm from "@/components/profile/profile-form";
import { editUser } from "@/lib/actions/user";
import { authOptions } from "@/lib/auth-options";
import { getUser } from "@/lib/data/user";
import { UserRoundPenIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import Form from "next/form";
import { toast } from "sonner";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const userProfile = await getUser(session?.user.address!);
  const { name, bio, links, tags, avatar, email } = userProfile?.info;

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
      await editUser(userInfo);
    } catch (error) {
      console.error("An error occured during profile submission!", error);
    }
  }

  return (
    <div>
      <Heading
        title="Profile"
        icon={<UserRoundPenIcon />}
        subtitle="This profile was imported from your Universal Profile. The information here will be used to help train your personal assistant and shape its responses."
      />
      <Form action={updateProfile} className="flex flex-col gap-6">
        <ProfileForm
          updateProfile={updateProfile}
          name={name}
          bio={bio}
          links={links}
          tags={tags}
          avatar={avatar}
          email={email}
        />
      </Form>
    </div>
  );
}
