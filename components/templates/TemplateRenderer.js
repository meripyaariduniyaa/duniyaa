'use client';

import React from 'react';
import BirthdayExperience from './birthday/BirthdayExperience';
import ProposalExperience from './proposal/ProposalExperience';
import AnniversaryExperience from './anniversary/AnniversaryExperience';
import ApologyExperience from './apology/ApologyExperience';

/**
 * Clean 4-Template Experience Dispatcher
 * Templates:
 * - 'proposal'           -> ProposalExperience
 * - 'birthday'           -> BirthdayExperience
 * - 'anniversary'        -> AnniversaryExperience
 * - 'emotional-apology'  -> ApologyExperience
 */
export default function TemplateRenderer({ note, isPreview = false, onReachEnd }) {
  if (!note) return null;

  const templateId = note.template || 'proposal';
  let experience;

  switch (templateId) {
    case 'proposal':
      experience = <ProposalExperience note={note} isPreview={isPreview} onReachEnd={onReachEnd} />;
      break;
    case 'anniversary':
      experience = <AnniversaryExperience note={note} isPreview={isPreview} onReachEnd={onReachEnd} />;
      break;
    case 'emotional-apology':
      experience = <ApologyExperience note={note} isPreview={isPreview} onReachEnd={onReachEnd} />;
      break;
    case 'birthday':
      experience = <BirthdayExperience note={note} isPreview={isPreview} onReachEnd={onReachEnd} />;
      break;
    default:
      experience = <ProposalExperience note={note} isPreview={isPreview} onReachEnd={onReachEnd} />;
  }

  return <div className="experience-wrapper">{experience}</div>;
}
