export type CampaignMedium = 'billboard' | 'newspaper' | 'social';

export interface CampaignMediumPrompt {
  medium: CampaignMedium;
  title: string;
  description: string;
  prompt: string;
  aspectRatio: '16:9' | '4:3' | '1:1';
}

export interface GeneratedCampaign {
  productName: string;
  productDescription: string;
  brandTone: string;
  prompts: CampaignMediumPrompt[];
}

export interface MediumConfig {
  id: CampaignMedium;
  label: string;
  aspectRatio: '16:9' | '4:3' | '1:1';
  description: string;
  iconName: string;
}

export const SUPPORTED_MEDIUMS: MediumConfig[] = [
  {
    id: 'billboard',
    label: 'Grand Billboard',
    aspectRatio: '16:9',
    description: 'An expansive outdoor showcase in a bustling, high-end city plaza.',
    iconName: 'Smartphone'
  },
  {
    id: 'newspaper',
    label: 'Vintage Newspaper',
    aspectRatio: '4:3',
    description: 'A classic, high-contrast monochrome printed ad page from the daily press.',
    iconName: 'FileText'
  },
  {
    id: 'social',
    label: 'Social Media Feed Story',
    aspectRatio: '1:1',
    description: 'A premium, modern lookbook tile on an elegant social feed layout.',
    iconName: 'Instagram'
  }
];
