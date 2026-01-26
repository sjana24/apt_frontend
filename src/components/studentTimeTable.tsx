import React, { useMemo } from 'react';
import { X, Clock, MapPin, User, BookOpen, Info } from 'lucide-react';

const TimetableModal = ({ isOpen, onClose, data, degreeName }) => {
  if (!isOpen) return null;

  // 1. Process Data: Get unique time slots and sort them
  const timeSlots = useMemo(() => {
    const slots = [...new Set(data.map(item => item.time_range))];
    return slots.sort();
  }, [data]);

  const days = [
    { label: 'Monday', value: 1 },
    { label: 'Tuesday', value: 2 },
    { label: 'Wednesday', value: 3 },
    { label: 'Thursday', value: 4 },
    { label: 'Friday', value: 5 },
  ];

  // Helper to find data for a specific cell
  const getCellData = (dayValue, timeRange) => {
    return data.find(item => item.day_of_week === dayValue && item.time_range === timeRange);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
              Weekly Timetable
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {degreeName || "Academic Schedule"}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto p-6">
          <div className="min-w-[800px]">
            <table className="w-full border-separate border-spacing-2">
              <thead>
                <tr>
                  <th className="w-32 p-2"></th> {/* Time column header */}
                  {days.map(day => (
                    <th key={day.value} className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      {day.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time, idx) => (
                  <tr key={idx}>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 py-2 rounded-lg">
                        <Clock className="w-3 h-3" />
                        {/* {time} */}
                      </div>
                    </td>
                    {days.map(day => {
                      const session = getCellData(day.value, time);
                      return (
                        <td key={day.value} className="relative group min-w-[140px]">
                          {session ? (
                            <div className="h-full p-3 rounded-xl border border-blue-100 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 transition-all hover:shadow-md cursor-help">
                              <div className="font-bold text-blue-700 dark:text-blue-400 text-sm">
                                {session.module_code}
                              </div>
                              <div className="text-xs font-medium text-blue-600/80 dark:text-blue-300/80 flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3" />
                                {session.lab_code}
                              </div>

                              {/* Custom Tooltip on Hover */}
                              <div className="absolute z-10 hidden group-hover:block w-64 p-4 bg-white dark:bg-slate-800 shadow-xl rounded-xl border border-slate-200 dark:border-slate-700 -top-2 left-full ml-2 pointer-events-none">
                                <div className="space-y-2">
                                  <div className="flex items-start gap-2">
                                    <BookOpen className="w-4 h-4 text-primary mt-1" />
                                    <div>
                                      <p className="text-xs text-slate-400 uppercase font-bold">Module</p>
                                      <p className="text-sm font-semibold">{session.module_name}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-primary mt-1" />
                                    <div>
                                      <p className="text-xs text-slate-400 uppercase font-bold">Location</p>
                                      <p className="text-sm">{session.lab_name}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <User className="w-4 h-4 text-primary mt-1" />
                                    <div>
                                      <p className="text-xs text-slate-400 uppercase font-bold">Staff</p>
                                      <p className="text-sm">{session.primary_staff?.staff_name}</p>
                                    </div>
                                  </div>
                                  {session.note && (
                                    <div className="pt-2 mt-2 border-t flex items-start gap-2">
                                      <Info className="w-4 h-4 text-amber-500 mt-1" />
                                      <p className="text-xs italic text-slate-500">{session.note}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="h-16 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center">
                              <span className="text-slate-300 dark:text-slate-700 text-xl">-</span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-slate-50 dark:bg-slate-800/50 text-center">
          <p className="text-xs text-slate-500">
            Hover over a module to see full details and staff information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimetableModal;