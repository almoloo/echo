"use client";

import { useFormStatus } from "react-dom";
import LinkItem from "@/components/profile/link-item";
import TagItem from "@/components/profile/tag-item";

interface ProfileFormProps {
  updateProfile: (formData: FormData) => Promise<void>;
  name?: string;
  email?: string;
  bio?: string;
  links: {
    title: string;
    url: string;
  }[];
  tags: string[];
  avatar?: string;
}

export default function ProfileForm(props: ProfileFormProps) {
  const { pending } = useFormStatus();
  return (
    <>
      <label>NAME:</label>
      <input
        type="text"
        name="name"
        placeholder="name"
        defaultValue={props.name}
      />

      <label>EMAIL:</label>
      <input
        type="text"
        name="email"
        placeholder="email"
        defaultValue={props.email}
      />

      <label>BIO:</label>
      <textarea
        name="bio"
        placeholder="description"
        defaultValue={props.bio}
      ></textarea>

      <label>LINKS:</label>
      {props.links.map((link, i) => (
        <LinkItem
          title={link.title}
          url={link.url}
          index={i}
          key={`link-item-${i}`}
        />
      ))}

      <label>TAGS:</label>
      {props.tags.map((tag, i) => (
        <TagItem tag={tag} index={i} key={`tag-item-${i}`} />
      ))}

      <button type="submit">Save {pending && "pending..."}</button>
    </>
  );
}
