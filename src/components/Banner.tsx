// src/components/Banner.tsx
type BannerProps = { title: string };

export default function Banner({ title }: BannerProps) {
  return <h1>{title}</h1>;
}
