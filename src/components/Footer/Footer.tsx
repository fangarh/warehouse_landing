import './Footer.css';
import type { ContactContent } from '../../types/content';
import { hasMeaningfulEmail, hasMeaningfulPhone } from '../../utils/contact';
import { formatPhoneForDisplay } from '../../utils/phone';

type FooterProps = {
  brandName: string;
  content: ContactContent;
  smallPrint: string;
};

export function Footer({ brandName, content, smallPrint }: FooterProps) {
  const contacts = [
    hasMeaningfulPhone(content.phone) ? (
      <a href={`tel:${content.phone}`} key="phone">
        {formatPhoneForDisplay(content.phone)}
      </a>
    ) : null,
    hasMeaningfulEmail(content.email) ? (
      <a href={`mailto:${content.email}`} key="email">
        {content.email}
      </a>
    ) : null,
  ].filter(Boolean);

  return (
    <footer className="site-footer section-shell section-shell--tight">
      <div className="container site-footer__inner">
        <div>
          <p className="site-footer__brand">{brandName}</p>
          <p className="site-footer__small-print">{smallPrint}</p>
        </div>

        {contacts.length > 0 ? (
          <div className="site-footer__contacts">{contacts}</div>
        ) : (
          <p className="site-footer__contact-note">Чтобы получить условия аренды и время просмотра, оставьте заявку через форму на сайте.</p>
        )}
      </div>
    </footer>
  );
}