import { getImage } from "@/lib/content/images";
import styles from "./company-card.module.css";
export function CompanyPhoto({ imageId, priority = false, profile = false }: { imageId?: string; priority?: boolean; profile?: boolean }) {
  const image = getImage(imageId);
  if (!image) return null;
  const sizes = profile ? "(max-width: 760px) calc(100vw - 32px), 360px" : "(max-width: 760px) calc(100vw - 32px), (max-width: 1200px) 45vw, 550px";
  return <figure className={styles.photo}>
    <picture><source type="image/avif" srcSet={image.widths.map(w => '/images/' + image.basename + '-' + w + '.avif ' + w + 'w').join(", ")} sizes={sizes} />
      <img src={'/images/' + image.basename + '-720.webp'} srcSet={image.widths.map(w => '/images/' + image.basename + '-' + w + '.webp ' + w + 'w').join(", ")} sizes={sizes} width={image.width} height={image.height} alt={image.alt} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" />
    </picture><figcaption>Imagine ilustrativă</figcaption>
  </figure>;
}
