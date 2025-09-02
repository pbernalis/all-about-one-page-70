// React hooks for capability and availability management

import { useMemo } from 'react';
import { getTemplateAvailability, getAvailableSections, getUpgradeSuggestions } from '@/cms/availability';
import { resolveCapabilities, type Plan, type Capability } from '@/cms/capabilities';
import { type LayoutId } from '@/cms/templates/meta';
import { type SectionId } from '@/cms/registry';

/**
 * Hook to get template availability for current user plan
 */
export function useTemplateAvailability(templateId: LayoutId, userPlan: Plan = 'free') {
  return useMemo(() => {
    return getTemplateAvailability(templateId, userPlan);
  }, [templateId, userPlan]);
}

/**
 * Hook to get available sections for a template
 */
export function useAvailableSections(templateId: LayoutId, userPlan: Plan = 'free') {
  return useMemo(() => {
    return getAvailableSections(templateId, userPlan);
  }, [templateId, userPlan]);
}

/**
 * Hook to get user capabilities based on plan
 */
export function useUserCapabilities(userPlan: Plan = 'free') {
  return useMemo(() => {
    return resolveCapabilities(userPlan);
  }, [userPlan]);
}

/**
 * Hook to check if specific capabilities are available
 */
export function useHasCapabilities(requiredCaps: Capability[], userPlan: Plan = 'free') {
  const userCaps = useUserCapabilities(userPlan);
  
  return useMemo(() => {
    return {
      hasAll: requiredCaps.every(cap => userCaps.has(cap)),
      hasSome: requiredCaps.some(cap => userCaps.has(cap)),
      missing: requiredCaps.filter(cap => !userCaps.has(cap)),
      available: requiredCaps.filter(cap => userCaps.has(cap)),
    };
  }, [requiredCaps, userCaps]);
}

/**
 * Hook to get upgrade suggestions for locked features
 */
export function useUpgradeSuggestions(templateId: LayoutId, userPlan: Plan = 'free') {
  return useMemo(() => {
    return getUpgradeSuggestions(templateId, userPlan);
  }, [templateId, userPlan]);
}

/**
 * Hook to filter sections by availability
 */
export function useFilteredSections(
  sections: SectionId[],
  templateId: LayoutId,
  userPlan: Plan = 'free',
  showLocked = false
) {
  const availability = useTemplateAvailability(templateId, userPlan);
  
  return useMemo(() => {
    if (showLocked) {
      return sections.map(sectionId => {
        const sectionAvailability = availability.sections.find(s => s.id === sectionId);
        return {
          id: sectionId,
          available: sectionAvailability?.available ?? false,
          requiredPlan: sectionAvailability?.requiredPlan,
          missing: sectionAvailability?.missing,
        };
      });
    }

    return sections
      .filter(sectionId => {
        const sectionAvailability = availability.sections.find(s => s.id === sectionId);
        return sectionAvailability?.available ?? false;
      })
      .map(sectionId => ({
        id: sectionId,
        available: true,
      }));
  }, [sections, availability, showLocked]);
}

/**
 * Hook for section metadata with availability info
 */
export function useSectionWithAvailability(
  sectionId: SectionId,
  templateId: LayoutId,
  userPlan: Plan = 'free'
) {
  const availability = useTemplateAvailability(templateId, userPlan);
  
  return useMemo(() => {
    const sectionAvailability = availability.sections.find(s => s.id === sectionId);
    return {
      id: sectionId,
      available: sectionAvailability?.available ?? false,
      requiredPlan: sectionAvailability?.requiredPlan,
      missing: sectionAvailability?.missing,
    };
  }, [sectionId, availability]);
}