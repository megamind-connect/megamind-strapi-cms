import type { Schema, Struct } from '@strapi/strapi';

export interface PrivacyPrivacySection extends Struct.ComponentSchema {
  collectionName: 'components_privacy_privacy_sections';
  info: {
    displayName: 'privacy_section';
  };
  attributes: {
    content: Schema.Attribute.Text;
    points: Schema.Attribute.Component<'terms.terms-bullet', true>;
    title: Schema.Attribute.String;
  };
}

export interface TermsSectionTerms extends Struct.ComponentSchema {
  collectionName: 'components_terms_section_terms';
  info: {
    displayName: 'terms';
  };
  attributes: {
    bullets: Schema.Attribute.Component<'terms.terms-bullet', true>;
    content: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface TermsContactInfo extends Struct.ComponentSchema {
  collectionName: 'components_terms_contact_infos';
  info: {
    displayName: 'contact_info';
  };
  attributes: {
    email: Schema.Attribute.String;
    locations: Schema.Attribute.Text;
    paragraph: Schema.Attribute.Text;
    text: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface TermsTermsBullet extends Struct.ComponentSchema {
  collectionName: 'components_terms_terms_bullets';
  info: {
    displayName: 'terms_bullet';
  };
  attributes: {
    text: Schema.Attribute.Text;
  };
}

export interface TermsTermsSection extends Struct.ComponentSchema {
  collectionName: 'components_terms_terms_sections';
  info: {
    displayName: 'terms_section';
  };
  attributes: {};
}

export interface TypingWordHomepage extends Struct.ComponentSchema {
  collectionName: 'components_typing_word_homepages';
  info: {
    displayName: 'homepage';
  };
  attributes: {
    word: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'privacy.privacy-section': PrivacyPrivacySection;
      'terms-section.terms': TermsSectionTerms;
      'terms.contact-info': TermsContactInfo;
      'terms.terms-bullet': TermsTermsBullet;
      'terms.terms-section': TermsTermsSection;
      'typing-word.homepage': TypingWordHomepage;
    }
  }
}
