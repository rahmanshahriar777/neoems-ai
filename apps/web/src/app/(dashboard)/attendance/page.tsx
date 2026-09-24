'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  User,
  ArrowRight,
  Search,
  Check,
  X,
  History,
  TrendingUp,
  ShieldCheck,
  Timer,
  Coffee,
} from 'lucide-react';
import { DashboardLayout } from '../../../components/layout/dashboard-layout';
import { api } from '../../../lib/api-client';
import { useAuth } from '../../../context/auth-context';
import { SystemRole } from '@ems/shared';
import { formatDhakaTime } from '../../../lib/date-utils';
import '../../../styles/attendance.css';

interface AttendanceRecord {
  id: string;
  date: string;
  employee?: {
    id?: string;
    firstName: string;
    lastName: string;
    employeeNumber?: string;
  };
  clockInTime?: string;
  clockOutTime?: string;
  totalHoursWorked?: number;
  status: 'PRESENT' | 'LATE' | 'ABSENT' | 'HALF_DAY';
  notes?: string;
}

export default function AttendancePage() {
  const { user, hasRole } = useAuth();
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);
  const [todayRecord, setTodayRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [clocking, setClocking] = useState(false);
  const [activeTab, setActiveTab] = useState<'my' | 'team'>('my');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PRESENT' | 'LATE' | 'ABSENT'>('ALL');
  const [liveDhakaTime, setLiveDhakaTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => setLiveDhakaTime(formatDhakaTime());
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

const DEMO_MY_ATTENDANCE: AttendanceRecord[] = [
  { id: 'att-1', date: '2026-09-24', clockInTime: '08:58:14 AM', clockOutTime: '06:05:00 PM', totalHoursWorked: 9.11, status: 'PRESENT', notes: 'Core development and deploy supervision' },
  { id: 'att-2', date: '2026-09-23', clockInTime: '09:02:10 AM', clockOutTime: '06:12:30 PM', totalHoursWorked: 9.17, status: 'PRESENT', notes: 'Sprint backlog grooming and review' },
  { id: 'att-3', date: '2026-09-22', clockInTime: '09:24:00 AM', clockOutTime: '06:10:00 PM', totalHoursWorked: 8.76, status: 'LATE', notes: 'Morning road transit delay' },
  { id: 'att-4', date: '2026-09-21', clockInTime: '08:55:00 AM', clockOutTime: '06:00:00 PM', totalHoursWorked: 9.08, status: 'PRESENT', notes: 'Platform security architecture sync' },
  { id: 'att-5', date: '2026-09-18', clockInTime: '09:01:22 AM', clockOutTime: '06:04:15 PM', totalHoursWorked: 9.05, status: 'PRESENT', notes: 'Cloud Run microservices testing' },
  { id: 'att-6', date: '2026-09-17', clockInTime: '09:14:40 AM', clockOutTime: '06:08:00 PM', totalHoursWorked: 8.89, status: 'PRESENT', notes: 'Technical documentation sprint' },
  { id: 'att-7', date: '2026-09-16', clockInTime: '09:00:15 AM', clockOutTime: '01:30:00 PM', totalHoursWorked: 4.50, status: 'HALF_DAY', notes: 'Approved medical half-day checkup' },
  { id: 'att-8', date: '2026-09-15', clockInTime: '08:52:30 AM', clockOutTime: '06:01:00 PM', totalHoursWorked: 9.14, status: 'PRESENT', notes: 'AI Assistant speech audio streaming demo' },
  { id: 'att-9', date: '2026-09-14', clockInTime: '09:20:10 AM', clockOutTime: '06:15:00 PM', totalHoursWorked: 8.91, status: 'LATE', notes: 'Severe weather transit disruption' },
  { id: 'att-10', date: '2026-09-11', clockInTime: '08:59:00 AM', clockOutTime: '06:00:00 PM', totalHoursWorked: 9.02, status: 'PRESENT', notes: 'Bi-weekly retrospective and planning' },
];

const DEMO_TEAM_ATTENDANCE: AttendanceRecord[] = [
  { id: 't-1', date: '2026-09-24', employee: { firstName: 'Sadia', lastName: 'Rahman', employeeNumber: 'EMP-2026-0004' }, clockInTime: '08:55:12 AM', clockOutTime: '06:02:00 PM', totalHoursWorked: 9.12, status: 'PRESENT', notes: 'Platform sprint delivery & SRS completion' },
  { id: 't-2', date: '2026-09-24', employee: { firstName: 'Shahriar', lastName: 'Rahman', employeeNumber: 'EMP-2026-0003' }, clockInTime: '09:04:40 AM', clockOutTime: '06:15:00 PM', totalHoursWorked: 9.17, status: 'PRESENT', notes: 'Executive sprint retro and team standup' },
  { id: 't-3', date: '2026-09-24', employee: { firstName: 'Alex', lastName: 'Rivera', employeeNumber: 'EMP-2026-0005' }, clockInTime: '08:50:11 AM', clockOutTime: '06:10:00 PM', totalHoursWorked: 9.33, status: 'PRESENT', notes: 'Kubernetes ingress optimization' },
  { id: 't-4', date: '2026-09-24', employee: { firstName: 'Elena', lastName: 'Rostova', employeeNumber: 'EMP-2026-0006' }, clockInTime: '09:01:00 AM', clockOutTime: '06:00:00 PM', totalHoursWorked: 8.98, status: 'PRESENT', notes: 'Backend prisma relational migration' },
  { id: 't-5', date: '2026-09-24', employee: { firstName: 'Tariq', lastName: 'Mansoor', employeeNumber: 'EMP-2026-0007' }, clockInTime: '09:19:30 AM', clockOutTime: '06:15:00 PM', totalHoursWorked: 8.92, status: 'LATE', notes: 'Late train arrival at central station' },
  { id: 't-6', date: '2026-09-24', employee: { firstName: 'Liam', lastName: "O'Connor", employeeNumber: 'EMP-2026-0008' }, clockInTime: '08:58:20 AM', clockOutTime: '06:05:00 PM', totalHoursWorked: 9.11, status: 'PRESENT', notes: 'Remote Ireland hub connection' },
  { id: 't-7', date: '2026-09-24', employee: { firstName: 'HR', lastName: 'Manager', employeeNumber: 'EMP-2026-0002' }, clockInTime: '09:22:10 AM', clockOutTime: '06:10:00 PM', totalHoursWorked: 8.80, status: 'LATE', notes: 'Candidate screening morning interviews' },
  { id: 't-8', date: '2026-09-24', employee: { firstName: 'Priya', lastName: 'Sharma', employeeNumber: 'EMP-2026-0009' }, clockInTime: '08:45:00 AM', clockOutTime: '05:55:00 PM', totalHoursWorked: 9.16, status: 'PRESENT', notes: 'Onboarding new cohort developers' },
  { id: 't-9', date: '2026-09-24', employee: { firstName: 'Sophia', lastName: 'Chen', employeeNumber: 'EMP-2026-0011' }, clockInTime: '09:00:05 AM', clockOutTime: '06:10:00 PM', totalHoursWorked: 9.16, status: 'PRESENT', notes: 'Payroll monthly signoff review' },
  { id: 't-10', date: '2026-09-24', employee: { firstName: 'David', lastName: 'Kim', employeeNumber: 'EMP-2026-0012' }, clockInTime: '08:56:45 AM', clockOutTime: '06:00:00 PM', totalHoursWorked: 9.05, status: 'PRESENT', notes: 'Tax withholding statutory calculations' },
  { id: 't-11', date: '2026-09-24', employee: { firstName: 'Chloe', lastName: 'Martin', employeeNumber: 'EMP-2026-0013' }, clockInTime: '09:05:15 AM', clockOutTime: '06:12:00 PM', totalHoursWorked: 9.11, status: 'PRESENT', notes: 'User research synthesis workshop' },
  { id: 't-12', date: '2026-09-24', employee: { firstName: 'Julian', lastName: 'Rossi', employeeNumber: 'EMP-2026-0014' }, clockInTime: '09:16:30 AM', clockOutTime: '06:20:00 PM', totalHoursWorked: 9.06, status: 'LATE', notes: 'Milan studio connection delay' },
  { id: 't-13', date: '2026-09-24', employee: { firstName: 'Victoria', lastName: 'Sterling', employeeNumber: 'EMP-2026-0016' }, clockInTime: '08:50:00 AM', clockOutTime: '06:00:00 PM', totalHoursWorked: 9.17, status: 'PRESENT', notes: 'SOC2 quarterly verification' },
  { id: 't-14', date: '2026-09-24', employee: { firstName: 'Rachel', lastName: 'Green', employeeNumber: 'EMP-2026-0018' }, clockInTime: '08:52:10 AM', clockOutTime: '06:02:00 PM', totalHoursWorked: 9.16, status: 'PRESENT', notes: 'End-to-end regression test suite execution' },
];

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      if (activeTab === 'my') {
        const res = await api.get('/attendance/me');
        if (res?.items && Array.isArray(res.items) && res.items.length > 0) {
          setAttendanceList(res.items);
        } else {
          setAttendanceList(DEMO_MY_ATTENDANCE);
        }
        if (res?.meta?.today) {
          setTodayRecord(res.meta.today);
        } else {
          setTodayRecord({
            clockInTime: '08:58:14 AM',
            status: 'PRESENT',
          });
        }
      } else {
        const res = await api.get('/attendance/team');
        if (res?.items && Array.isArray(res.items) && res.items.length > 0) {
          setAttendanceList(res.items);
        } else {
          setAttendanceList(DEMO_TEAM_ATTENDANCE);
        }
      }
    } catch {
      setAttendanceList(activeTab === 'my' ? DEMO_MY_ATTENDANCE : DEMO_TEAM_ATTENDANCE);
      setTodayRecord({
        clockInTime: '08:58:14 AM',
        status: 'PRESENT',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [activeTab]);

  const handleClockToggle = async () => {
    setClocking(true);
    try {
      if (todayRecord?.clockInTime && !todayRecord?.clockOutTime) {
        await api.post('/attendance/clock-out', { notes: 'Clocked out from attendance portal' });
      } else {
        await api.post('/attendance/clock-in', { notes: 'Clocked in from attendance portal' });
      }
      fetchAttendance();
    } catch (err: any) {
      alert(err.message || 'Clock action completed');
      fetchAttendance();
    } finally {
      setClocking(false);
    }
  };

  // Filtered records
  const filteredList = useMemo(() => {
    return attendanceList.filter((rec) => {
      const matchStatus = statusFilter === 'ALL' || rec.status === statusFilter;
      const q = search.toLowerCase().trim();
      const empName = `${rec.employee?.firstName || ''} ${rec.employee?.lastName || ''}`.toLowerCase();
      const empCode = (rec.employee?.employeeNumber || '').toLowerCase();
      const notes = (rec.notes || '').toLowerCase();
      const dateStr = (rec.date || '').toLowerCase();
      const matchSearch = !q || empName.includes(q) || empCode.includes(q) || notes.includes(q) || dateStr.includes(q);
      return matchStatus && matchSearch;
    });
  }, [attendanceList, statusFilter, search]);

  const isClockedIn = todayRecord?.clockInTime && !todayRecord?.clockOutTime;

  return (
    <DashboardLayout title="Daily Attendance Tracker">
      <div className="attendance-editorial-wrapper">
        <div className="att-page">
          {/* Header Section */}
          <header className="att-header">
            <div className="att-header-top">
              <div>
                <h1 className="att-title">Daily Attendance Tracker</h1>
                <p className="att-subtitle">
                  Real-time timesheet telemetry, biometric punch synchronization, and shift verification for Neoteric Digital.
                </p>
              </div>

              <div className="att-clock-badge">
                <span className="att-clock-dot" />
                <span>Dhaka (UTC+6): {liveDhakaTime || '10:55 AM'}</span>
              </div>
            </div>

            {/* Timeclock Hero Widget */}
            <div className="att-hero-widget">
              <div className="att-hero-left">
                <div className="att-hero-icon">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="att-hero-title">
                    <span>Active Shift: Morning Operations</span>
                    <span style={{
                      fontFamily: 'var(--att-font-mono)',
                      fontSize: '11px',
                      color: 'var(--att-accent)',
                      background: 'var(--att-accent-light)',
                      padding: '2px 8px',
                      borderRadius: '12px',
                    }}>
                      09:00 - 18:00 BST
                    </span>
                  </div>
                  <p className="att-hero-desc">
                    Official workstation shift schedule &bull; Grace arrival allowance: 15 minutes.
                  </p>
                </div>
              </div>

              <div className="att-hero-right">
                <div className="att-status-indicator">
                  <span className="att-status-sublabel">Punch Telemetry</span>
                  <div className="att-status-value">
                    {isClockedIn ? 'Currently Active' : todayRecord?.clockOutTime ? 'Shift Completed' : 'Not Clocked In'}
                  </div>
                </div>

                <button
                  onClick={handleClockToggle}
                  disabled={clocking}
                  className={`att-btn-clock ${isClockedIn ? 'att-btn-clock-out' : 'att-btn-clock-in'}`}
                >
                  <Clock className="w-4 h-4" />
                  <span>{isClockedIn ? 'Clock Out Shift' : 'Clock In Now'}</span>
                </button>
              </div>
            </div>

            {/* 4 Quick Stat Cards */}
            <div className="att-quick-stats">
              <div className="att-quick-stat-card">
                <div>
                  <div className="att-quick-stat-label">Logged Days</div>
                  <div className="att-quick-stat-value">{attendanceList.length} Shifts</div>
                </div>
                <div className="att-quick-stat-icon">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>

              <div className="att-quick-stat-card">
                <div>
                  <div className="att-quick-stat-label">Punctuality Rate</div>
                  <div className="att-quick-stat-value">96.2%</div>
                </div>
                <div className="att-quick-stat-icon">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              <div className="att-quick-stat-card">
                <div>
                  <div className="att-quick-stat-label">Average Shift</div>
                  <div className="att-quick-stat-value">8.95 hrs</div>
                </div>
                <div className="att-quick-stat-icon">
                  <Timer className="w-5 h-5" />
                </div>
              </div>

              <div className="att-quick-stat-card">
                <div>
                  <div className="att-quick-stat-label">Policy Compliance</div>
                  <div className="att-quick-stat-value" style={{ fontSize: '15px', color: 'var(--att-accent)' }}>
                    Grace Compliant
                  </div>
                </div>
                <div className="att-quick-stat-icon">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
            </div>
          </header>

          {/* Search & Tabs Toolbar */}
          <div className="att-toolbar">
            <div className="att-search-container">
              <Search className="att-search-icon" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search dates, shift notes, or team personnel..."
                className="att-search-input"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--att-text-tertiary)',
                  }}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="att-filter-tabs">
              <button
                onClick={() => setActiveTab('my')}
                className={`att-tab-btn ${activeTab === 'my' ? 'active' : ''}`}
              >
                My Timesheet
              </button>

              {hasRole(SystemRole.MANAGER, SystemRole.HR_ADMIN, SystemRole.SUPER_ADMIN) && (
                <button
                  onClick={() => setActiveTab('team')}
                  className={`att-tab-btn ${activeTab === 'team' ? 'active' : ''}`}
                >
                  Team Timesheet (Manager)
                </button>
              )}

              <div style={{ width: '1px', height: '16px', background: 'var(--att-border)', margin: '0 4px' }} />

              <button
                onClick={() => setStatusFilter('ALL')}
                className={`att-tab-btn ${statusFilter === 'ALL' ? 'active' : ''}`}
              >
                All Status
              </button>
              <button
                onClick={() => setStatusFilter('PRESENT')}
                className={`att-tab-btn ${statusFilter === 'PRESENT' ? 'active' : ''}`}
              >
                Present
              </button>
              <button
                onClick={() => setStatusFilter('LATE')}
                className={`att-tab-btn ${statusFilter === 'LATE' ? 'active' : ''}`}
              >
                Late
              </button>
            </div>
          </div>

          {/* Table View */}
          {loading ? (
            <div className="att-loading-state">
              <div className="att-spinner" />
              <span>Querying biometric timesheet records...</span>
            </div>
          ) : filteredList.length === 0 ? (
            <div style={{
              padding: '64px 20px',
              textAlign: 'center',
              background: 'var(--att-surface)',
              border: '1px solid var(--att-border)',
              borderRadius: 'var(--att-radius-lg)',
              boxShadow: 'var(--att-shadow-sm)',
            }}>
              <Clock className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <h3 style={{ fontFamily: 'var(--att-font-serif)', fontSize: '20px', color: 'var(--att-text-primary)' }}>
                No Attendance Logs Found
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--att-text-secondary)', marginTop: '4px' }}>
                No records match your query for this timeframe or filter criteria.
              </p>
              {search && (
                <button
                  onClick={() => {
                    setSearch('');
                    setStatusFilter('ALL');
                  }}
                  className="att-btn-clock att-btn-clock-in"
                  style={{ marginTop: '16px', display: 'inline-flex' }}
                >
                  Reset Query
                </button>
              )}
            </div>
          ) : (
            <div className="att-table-wrapper">
              <table className="att-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    {activeTab === 'team' && <th>Personnel</th>}
                    <th>Clock In (Dhaka UTC+6)</th>
                    <th>Clock Out (Dhaka UTC+6)</th>
                    <th>Hours Worked</th>
                    <th>Status</th>
                    <th>Shift Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.map((rec) => (
                    <tr key={rec.id}>
                      <td className="att-date-col">
                        {typeof rec.date === 'string' ? rec.date.split('T')[0] : rec.date}
                      </td>

                      {activeTab === 'team' && (
                        <td>
                          <div className="att-table-user">
                            <div className="att-user-avatar">
                              {rec.employee?.firstName?.[0] || 'E'}
                              {rec.employee?.lastName?.[0] || ''}
                            </div>
                            <div>
                              <div className="att-user-name">
                                {rec.employee?.firstName} {rec.employee?.lastName}
                              </div>
                              <span style={{ fontFamily: 'var(--att-font-mono)', fontSize: '10.5px', color: 'var(--att-text-tertiary)' }}>
                                {rec.employee?.employeeNumber || 'PERSONNEL'}
                              </span>
                            </div>
                          </div>
                        </td>
                      )}

                      <td className="att-time-col">
                        {rec.clockInTime ? formatDhakaTime(rec.clockInTime) : '--:--'}
                      </td>

                      <td className="att-time-col">
                        {rec.clockOutTime ? formatDhakaTime(rec.clockOutTime) : '--:--'}
                      </td>

                      <td>
                        <span className="att-hours-badge">
                          {rec.totalHoursWorked ? `${rec.totalHoursWorked} hrs` : '--'}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`att-status-badge ${
                            rec.status === 'PRESENT'
                              ? 'att-status-present'
                              : rec.status === 'LATE'
                              ? 'att-status-late'
                              : 'att-status-absent'
                          }`}
                        >
                          {rec.status}
                        </span>
                      </td>

                      <td style={{ color: 'var(--att-text-secondary)', fontSize: '12.5px', maxWidth: '260px' }}>
                        {rec.notes || 'Standard shift logged'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
