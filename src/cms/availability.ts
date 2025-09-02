// Availability resolver - determines what sections/templates are available
// based on user plan and template capabilities

import { resolveCapabilities, type Plan, type Capability, getMinPlanForCapability } from './capabilities';
import { TEMPLATES_META, type LayoutId } from './templates/meta';
import { SECTIONS_META, type SectionId } from './registry';

export interface SectionAvailability {
  id: SectionId;
  available: boolean;
  missing?: Capability[];
  requiredPlan?: Plan;
}

export interface TemplateAvailability {
  templateId: LayoutId;
  available: boolean;
  userPlan: Plan;
  templateCaps: Set<Capability>;
  sections: SectionAvailability[];
  missingCapabilities?: Capability[];
  requiredPlan?: Plan;
}

/**
 * Get section availability for a specific template and user plan
 */
export function getTemplateAvailability(templateId: LayoutId, userPlan: Plan): TemplateAvailability {
  const template = TEMPLATES_META.find(t => t.id === templateId);
  if (!template) {
    throw new Error(`Unknown template: ${templateId}`);
  }

  const userCaps = resolveCapabilities(userPlan);
  const templateCaps = new Set<Capability>(template.capabilities.filter(c => userCaps.has(c)));

  // Check if template itself is available
  const planOrder: Plan[] = ['free', 'pro', 'business', 'enterprise'];
  const userPlanIndex = planOrder.indexOf(userPlan);
  const templatePlanIndex = planOrder.indexOf(template.minPlan);
  const templateAvailable = templatePlanIndex <= userPlanIndex;

  // Calculate section availability
  const sections: SectionAvailability[] = SECTIONS_META.map(section => {
    const missing = section.requires.filter(req => !templateCaps.has(req));
    const available = missing.length === 0;
    
    let requiredPlan: Plan | undefined;
    if (!available && missing.length > 0) {
      // Find the minimum plan that would unlock all missing capabilities
      const requiredPlans = missing.map(cap => getMinPlanForCapability(cap));
      const maxPlanIndex = Math.max(...requiredPlans.map(p => planOrder.indexOf(p)));
      requiredPlan = planOrder[maxPlanIndex];
    }

    return {
      id: section.id,
      available,
      missing: missing.length > 0 ? missing : undefined,
      requiredPlan,
    };
  });

  // Calculate missing capabilities for template
  const missingTemplateCaps = template.capabilities.filter(cap => !userCaps.has(cap));

  return {
    templateId,
    available: templateAvailable,
    userPlan,
    templateCaps,
    sections,
    missingCapabilities: missingTemplateCaps.length > 0 ? missingTemplateCaps : undefined,
    requiredPlan: !templateAvailable ? template.minPlan : undefined,
  };
}

/**
 * Get all available sections for a template and user plan
 */
export function getAvailableSections(templateId: LayoutId, userPlan: Plan): SectionId[] {
  const availability = getTemplateAvailability(templateId, userPlan);
  return availability.sections
    .filter(section => section.available)
    .map(section => section.id);
}

/**
 * Get all available templates for a user plan
 */
export function getAvailableTemplates(userPlan: Plan): LayoutId[] {
  const planOrder: Plan[] = ['free', 'pro', 'business', 'enterprise'];
  const userPlanIndex = planOrder.indexOf(userPlan);
  
  return TEMPLATES_META
    .filter(template => {
      const templatePlanIndex = planOrder.indexOf(template.minPlan);
      return templatePlanIndex <= userPlanIndex;
    })
    .map(template => template.id);
}

/**
 * Check if a specific section is available for a template and user plan
 */
export function isSectionAvailable(
  sectionId: SectionId, 
  templateId: LayoutId, 
  userPlan: Plan
): boolean {
  const availability = getTemplateAvailability(templateId, userPlan);
  const section = availability.sections.find(s => s.id === sectionId);
  return section?.available ?? false;
}

/**
 * Get upgrade suggestions for locked features
 */
export function getUpgradeSuggestions(templateId: LayoutId, userPlan: Plan): {
  sections: Array<{ id: SectionId; requiredPlan: Plan; capabilities: Capability[] }>;
  template?: { requiredPlan: Plan; capabilities: Capability[] };
} {
  const availability = getTemplateAvailability(templateId, userPlan);
  
  const lockedSections = availability.sections
    .filter(section => !section.available && section.requiredPlan && section.missing)
    .map(section => ({
      id: section.id,
      requiredPlan: section.requiredPlan!,
      capabilities: section.missing!,
    }));

  const templateUpgrade = !availability.available && availability.requiredPlan && availability.missingCapabilities
    ? {
        requiredPlan: availability.requiredPlan,
        capabilities: availability.missingCapabilities,
      }
    : undefined;

  return {
    sections: lockedSections,
    template: templateUpgrade,
  };
}

/**
 * Filter sections by availability for UI display
 */
export function filterSectionsByAvailability(
  sections: SectionId[],
  templateId: LayoutId,
  userPlan: Plan,
  includeUnavailable = false
): SectionId[] {
  if (includeUnavailable) {
    return sections;
  }

  const availableSections = getAvailableSections(templateId, userPlan);
  return sections.filter(sectionId => availableSections.includes(sectionId));
}

/**
 * Get capability requirements for a list of sections
 */
export function getSectionCapabilities(sectionIds: SectionId[]): {
  required: Set<Capability>;
  optional: Set<Capability>;
} {
  const required = new Set<Capability>();
  const optional = new Set<Capability>();

  sectionIds.forEach(sectionId => {
    const section = SECTIONS_META.find(s => s.id === sectionId);
    if (section) {
      section.requires.forEach(cap => required.add(cap));
      section.optional?.forEach(cap => optional.add(cap));
    }
  });

  return { required, optional };
}