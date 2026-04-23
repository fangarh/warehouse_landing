import { type ChangeEvent, type FormEvent, useState } from 'react';
import './ContactBlock.css';
import { submitLead } from '../../services/leadsService';
import type { ContactContent } from '../../types/content';
import type { LeadFormErrors, LeadFormPayload } from '../../types/lead';
import { hasMeaningfulEmail, hasMeaningfulHref, hasMeaningfulPhone } from '../../utils/contact';
import { formatPhoneForDisplay, normalizePhone } from '../../utils/phone';
import { validateLeadForm } from '../../utils/validation';

type ContactBlockProps = {
  content: ContactContent;
};

const initialFormState: LeadFormPayload = {
  name: '',
  phone: '',
  comment: '',
  consent: false,
};

export function ContactBlock({ content }: ContactBlockProps) {
  const [formState, setFormState] = useState<LeadFormPayload>(initialFormState);
  const [errors, setErrors] = useState<LeadFormErrors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const directContacts = [
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

  const messengers = content.messengers.filter((messenger) => hasMeaningfulHref(messenger.href));

  const handleTextChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleConsentChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormState((current) => ({ ...current, consent: event.target.checked }));
    setErrors((current) => ({ ...current, consent: undefined }));
  };

  const handlePhoneBlur = () => {
    setFormState((current) => ({
      ...current,
      phone: normalizePhone(current.phone),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateLeadForm(formState);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus('error');
      setStatusMessage(content.errorMessage);
      return;
    }

    setStatus('loading');
    setStatusMessage('');

    try {
      const result = await submitLead(formState);
      setStatus(result.ok ? 'success' : 'error');
      setStatusMessage(result.ok ? content.successMessage : content.errorMessage);
      if (result.ok) {
        setFormState(initialFormState);
        setErrors({});
      }
    } catch {
      setStatus('error');
      setStatusMessage(content.errorMessage);
    }
  };

  return (
    <section className="contact-block section-shell" id="contact">
      <div className="container contact-block__layout surface-panel">
        <div className="contact-block__intro">
          <span className="section-heading__eyebrow">Получить предложение</span>
          <h2>{content.title}</h2>
          <p>{content.description}</p>

          {directContacts.length > 0 ? <div className="contact-block__direct-links">{directContacts}</div> : null}

          {messengers.length > 0 ? (
            <div className="contact-block__messengers" aria-label="Мессенджеры для связи">
              {messengers.map((messenger) => (
                <a href={messenger.href} key={messenger.id} rel="noreferrer" target="_blank">
                  {messenger.label}
                </a>
              ))}
            </div>
          ) : null}

          {directContacts.length === 0 && messengers.length === 0 ? (
            <p className="contact-block__contact-note">
              Самый быстрый способ получить доступные варианты и условия аренды сейчас - оставить заявку через форму.
              В ответ уточним детали, предложим подходящий формат и согласуем просмотр объекта.
            </p>
          ) : null}
        </div>

        <form className="contact-form" noValidate onSubmit={handleSubmit}>
          <label className="contact-form__field">
            <span>Контактное лицо</span>
            <input
              name="name"
              placeholder="Имя и компания"
              type="text"
              value={formState.name}
              onChange={handleTextChange}
            />
            {errors.name ? <small>{errors.name}</small> : null}
          </label>

          <label className="contact-form__field">
            <span>Телефон для связи</span>
            <input
              name="phone"
              placeholder="+7 (___) ___-__-__"
              type="tel"
              value={formState.phone}
              onBlur={handlePhoneBlur}
              onChange={handleTextChange}
            />
            {errors.phone ? <small>{errors.phone}</small> : null}
          </label>

          <label className="contact-form__field">
            <span>Что нужно разместить</span>
            <textarea
              name="comment"
              placeholder="Например: нужен корпус целиком под склад и отгрузку, либо 500-800 м² внутри комплекса и открытая площадка под технику"
              rows={5}
              value={formState.comment}
              onChange={handleTextChange}
            />
          </label>

          <label className="contact-form__consent">
            <input checked={formState.consent} type="checkbox" onChange={handleConsentChange} />
            <span>{content.consentText}</span>
          </label>
          {errors.consent ? <small className="contact-form__error">{errors.consent}</small> : null}

          <button className="button-link button-link--primary contact-form__submit" disabled={status === 'loading'} type="submit">
            {status === 'loading' ? 'Готовим предложение...' : content.submitLabel}
          </button>

          {status !== 'idle' && statusMessage ? (
            <p className={`contact-form__status is-${status}`}>{statusMessage}</p>
          ) : null}
        </form>
      </div>
    </section>
  );
}