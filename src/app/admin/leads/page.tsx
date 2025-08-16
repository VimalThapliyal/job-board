import {
  getLeadsFromDatabase,
  getLeadStats,
  getJobsFromDatabase,
} from "@/lib/database";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JobEditor from "@/components/JobEditor";
import AdminAuth from "@/components/AdminAuth";
import { qualifyLead } from "@/lib/lead-qualification";
import { Lead } from "@/types/lead";

export default async function LeadsPage() {
  const leads = await getLeadsFromDatabase();
  const stats = await getLeadStats();
  const rawJobs = await getJobsFromDatabase();

  // Clean jobs data to remove MongoDB-specific fields
  const jobs = rawJobs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    type: job.type,
    salary: job.salary,
    description: job.description,
    applyUrl: job.applyUrl,
    postedDate: job.postedDate,
    logo: job.logo,
    tags: job.tags,
    experience: job.experience,
    skills: job.skills,
  }));

  // Calculate lead statistics
  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter(lead => lead.qualificationScore >= 40).length;
  const soldLeads = leads.filter(lead => lead.status === 'sold').length;
  const totalRevenue = leads
    .filter(lead => lead.status === 'sold')
    .reduce((sum, lead) => {
      const price = lead.qualificationScore >= 80 ? 200 : 
                   lead.qualificationScore >= 60 ? 150 : 
                   lead.qualificationScore >= 40 ? 100 : 50;
      return sum + price;
    }, 0);
  const averageLeadPrice = qualifiedLeads > 0 ? Math.round(totalRevenue / qualifiedLeads) : 0;
  const conversionRate = totalLeads > 0 ? Math.round((soldLeads / totalLeads) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <AdminAuth>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🎯 Lead Management Dashboard
            </h1>
            <p className="text-gray-600">
              Manage and monetize your React developer leads
            </p>
          </div>

          {/* Lead Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Leads</p>
                  <p className="text-3xl font-bold text-gray-900">{totalLeads}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Qualified Leads</p>
                  <p className="text-3xl font-bold text-green-600">{qualifiedLeads}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sold Leads</p>
                  <p className="text-3xl font-bold text-purple-600">{soldLeads}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-indigo-600">${totalRevenue.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-indigo-100 rounded-full">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Lead Management Table */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Lead Management</h2>
              <p className="text-gray-600 mt-1">
                Review, qualify, and monetize your leads
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads.map((lead) => {
                    const qualification = qualifyLead(lead as Lead);
                    const price = qualification.price;
                    const level = qualification.level;
                    
                    return (
                      <tr key={lead.jobId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {lead.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {lead.email}
                            </div>
                            {lead.phone && (
                              <div className="text-sm text-gray-500">
                                {lead.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {lead.jobTitle}
                            </div>
                            <div className="text-sm text-gray-500">
                              {lead.company}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="flex items-center">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  qualification.score >= 80 ? 'bg-purple-100 text-purple-800' :
                                  qualification.score >= 60 ? 'bg-blue-100 text-blue-800' :
                                  qualification.score >= 40 ? 'bg-green-100 text-green-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {qualification.score}/100
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ${price}
                          </div>
                          <div className="text-sm text-gray-500">
                            {level} level
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            lead.status === 'sold' ? 'bg-green-100 text-green-800' :
                            lead.status === 'qualified' ? 'bg-blue-100 text-blue-800' :
                            lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                            lead.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-indigo-600 hover:text-indigo-900">
                              View
                            </button>
                            {lead.status === 'new' && qualification.score >= 40 && (
                              <button className="text-green-600 hover:text-green-900">
                                Qualify
                              </button>
                            )}
                            {lead.status === 'qualified' && (
                              <button className="text-purple-600 hover:text-purple-900">
                                Sell
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Revenue Projections */}
          <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              💰 Revenue Projections
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${(qualifiedLeads * averageLeadPrice).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Potential Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {conversionRate}%
                </div>
                <div className="text-sm text-gray-600">Conversion Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  ${averageLeadPrice}
                </div>
                <div className="text-sm text-gray-600">Average Lead Price</div>
              </div>
            </div>
          </div>
        </div>
      </AdminAuth>
      <Footer />
    </div>
  );
}
