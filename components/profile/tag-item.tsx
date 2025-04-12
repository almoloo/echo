interface TagItemProps {
  tag: string;
  index: number;
}

export default function TagItem({ tag, index }: TagItemProps) {
  return (
    <div>
      <input type="text" name="tags" defaultValue={tag} />
    </div>
  );
}
