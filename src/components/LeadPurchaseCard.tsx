"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Star,
  Calendar,
  MapPin,
} from "lucide-react";
import type { Lead, Company } from "@/types/lead";

interface LeadPurchaseCardProps {
  lead: Lead;
  company: Company;
}

export default function LeadPurchaseCard({
  lead,
  company,
}: LeadPurchaseCardProps) {
  const getLeadLevel = (score: number): string => {
    if (score >= 80) return "Lead";
    if (score >= 60) return "Senior";
    if (score >= 40) return "Mid-level";
    return "Junior";
  };

  const getQualificationColor = (score: number): string => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-blue-600 bg-blue-100";
    if (score >= 40) return "text-yellow-600 bg-yellow-100";
    return "text-gray-600 bg-gray-100";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{lead.jobTitle}</h2>
            <p className="text-blue-100">{company.name}</p>
          </div>
          <div className="text-right">
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getQualificationColor(
                lead.qualificationScore
              )}`}
            >
              <Star className="w-4 h-4 mr-1" />
              {lead.qualificationScore}/100
            </div>
          </div>
        </div>
      </div>

      {/* Lead Information */}
      <div className="p-6 space-y-4">
        {/* Candidate Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Candidate</p>
                <p className="font-medium text-gray-900">{lead.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{lead.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">{lead.phone}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Briefcase className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Experience</p>
                <p className="font-medium text-gray-900">{lead.experience}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Star className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Level</p>
                <p className="font-medium text-gray-900">
                  {getLeadLevel(lead.qualificationScore)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Applied</p>
                <p className="font-medium text-gray-900">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cover Letter */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-2">Cover Letter</h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            {lead.coverLetter}
          </p>
        </div>

        {/* Resume */}
        {lead.resumeUrl && (
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-2">Resume</h4>
            <a
              href={lead.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              View Resume
            </a>
          </div>
        )}

        {/* Status Badge */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Status:</span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  lead.status === "new"
                    ? "bg-blue-100 text-blue-800"
                    : lead.status === "qualified"
                    ? "bg-green-100 text-green-800"
                    : lead.status === "contacted"
                    ? "bg-yellow-100 text-yellow-800"
                    : lead.status === "sold"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
              </span>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-600">Qualification Score</p>
              <p
                className={`text-lg font-bold ${
                  getQualificationColor(lead.qualificationScore).split(" ")[0]
                }`}
              >
                {lead.qualificationScore}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
