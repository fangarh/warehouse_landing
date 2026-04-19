import { useState } from 'react';
import './PricingBlock.css';
import type { PricingBillingContent, PricingValue, SiteContent } from '../../types/content';
import { handleAnchorNavigation } from '../../utils/scroll';

type PricingBlockProps = {
  content: SiteContent['pricing'];
};

type BillingMode = 'monthly' | 'yearly';

type PricingView = {
  prefix?: string;
  amountLabel: string;
  periodLabel: string;
  compareLabel?: string;
  discountLabel?: string;
  savingsLabel?: string;
};

function formatAmount(amount: number): string {
  return `${amount.toLocaleString('ru-RU')} ₽`;
}

function getPricingView(
  pricing: PricingValue,
  billingMode: BillingMode,
  billing: PricingBillingContent,
): PricingView {
  if (typeof pricing.amount !== 'number') {
    return {
      amountLabel: 'Индивидуально',
      periodLabel: billingMode === 'yearly' ? billing.yearlyLabel.toLowerCase() : billing.monthlyLabel.toLowerCase(),
    };
  }

  if (billingMode === 'monthly') {
    return {
      prefix: 'от',
      amountLabel: formatAmount(pricing.amount),
      periodLabel: pricing.periodLabel ?? billing.monthlyLabel.toLowerCase(),
    };
  }

  const annualDiscountPercent = pricing.annualDiscountPercent ?? 0;
  const regularAnnualAmount = pricing.amount * 12;
  const discountedAnnualAmount =
    annualDiscountPercent > 0
      ? Math.round((regularAnnualAmount * (100 - annualDiscountPercent)) / 100)
      : regularAnnualAmount;

  return {
    prefix: 'от',
    amountLabel: formatAmount(discountedAnnualAmount),
    periodLabel: billing.yearlyLabel.toLowerCase(),
    compareLabel: annualDiscountPercent > 0 ? `вместо ${formatAmount(regularAnnualAmount)}` : undefined,
    discountLabel: annualDiscountPercent > 0 ? `-${annualDiscountPercent}%` : undefined,
    savingsLabel:
      annualDiscountPercent > 0
        ? `Экономия ${formatAmount(regularAnnualAmount - discountedAnnualAmount)} при оплате за 12 месяцев`
        : undefined,
  };
}

export function PricingBlock({ content }: PricingBlockProps) {
  const [billingMode, setBillingMode] = useState<BillingMode>('monthly');

  const maxAnnualDiscount = content.plans.reduce(
    (maxDiscount, plan) => Math.max(maxDiscount, plan.pricing.annualDiscountPercent ?? 0),
    0,
  );

  return (
    <section className="pricing-block section-shell" id="pricing">
      <div className="container">
        <div className="pricing-block__topbar">
          <div className="section-heading pricing-block__heading">
            <span className="section-heading__eyebrow">Форматы аренды</span>
            <h2>{content.title}</h2>
            <p>{content.intro}</p>
          </div>

          <div className="pricing-block__billing surface-panel" role="group" aria-label={content.billing.label}>
            <p className="pricing-block__billing-label">{content.billing.label}</p>
            <div className="pricing-block__billing-toggle">
              <button
                className={`pricing-block__billing-button${billingMode === 'monthly' ? ' is-active' : ''}`}
                type="button"
                onClick={() => setBillingMode('monthly')}
                aria-pressed={billingMode === 'monthly'}
              >
                {content.billing.monthlyLabel}
              </button>
              <button
                className={`pricing-block__billing-button${billingMode === 'yearly' ? ' is-active' : ''}`}
                type="button"
                onClick={() => setBillingMode('yearly')}
                aria-pressed={billingMode === 'yearly'}
              >
                <span>{content.billing.yearlyLabel}</span>
                {maxAnnualDiscount > 0 ? (
                  <span className="pricing-block__billing-discount">-{maxAnnualDiscount}%</span>
                ) : null}
              </button>
            </div>
            <p className="pricing-block__billing-hint">
              {billingMode === 'yearly' ? content.billing.yearlyHint : content.billing.monthlyHint}
            </p>
          </div>
        </div>

        <p className="mobile-swipe-hint">Свайпните, чтобы сравнить форматы аренды</p>

        <div className="pricing-block__layout">
          {content.plans.map((plan) => {
            const pricingView = getPricingView(plan.pricing, billingMode, content.billing);

            return (
              <article
                className={`pricing-block__plan surface-panel${plan.highlighted ? ' is-highlighted' : ''}`}
                key={plan.id}
              >
                {plan.audienceLabel ? <p className="pricing-block__audience">{plan.audienceLabel}</p> : null}
                <h3>{plan.name}</h3>

                <div className="pricing-block__price-group">
                  <div className="pricing-block__price-row">
                    <p className="pricing-block__price">
                      {pricingView.prefix ? <span className="pricing-block__price-prefix">{pricingView.prefix}</span> : null}
                      <span className="pricing-block__price-value">{pricingView.amountLabel}</span>
                    </p>
                    {pricingView.discountLabel ? (
                      <span className="pricing-block__price-discount">{pricingView.discountLabel}</span>
                    ) : null}
                  </div>

                  <div className="pricing-block__price-meta">
                    <span className="pricing-block__period">{pricingView.periodLabel}</span>
                    {pricingView.compareLabel ? (
                      <span className="pricing-block__compare">{pricingView.compareLabel}</span>
                    ) : null}
                  </div>

                  {pricingView.savingsLabel ? (
                    <p className="pricing-block__savings">{pricingView.savingsLabel}</p>
                  ) : null}
                </div>

                <p className="pricing-block__description">{plan.description}</p>
                <ul className="pricing-block__features">
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                {plan.note ? <p className="pricing-block__note">{plan.note}</p> : null}
                <a
                  className={`button-link ${plan.highlighted ? 'button-link--primary' : 'button-link--secondary-dark'}`}
                  href={plan.cta.href}
                  onClick={(event) => handleAnchorNavigation(event, plan.cta.href)}
                >
                  {plan.cta.label}
                </a>
              </article>
            );
          })}
        </div>

        <p className="pricing-block__footer-note">{content.note}</p>
      </div>
    </section>
  );
}