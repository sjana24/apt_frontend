import { useState } from 'react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TimetableEntry {
  id: string;
  day: string;
  time: string;
  courseName: string;
  courseCode: string;
  lecturerName: string;
  classroom: string;
}

const academicYears = ['2024/2025', '2023/2024', '2022/2023'];
const degreePrograms = [
  'BSc Computer Science',
  'BSc Information Technology',
  'BSc Software Engineering',
  'BSc Data Science',
  'BSc Cyber Security',
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Mock timetable data
const mockTimetableData: Record<string, TimetableEntry[]> = {
  'BSc Computer Science': [
    { id: '1', day: 'Monday', time: '08:00 - 10:00', courseName: 'Data Structures', courseCode: 'CS201', lecturerName: 'Dr. James Wilson', classroom: 'Room A101' },
    { id: '2', day: 'Monday', time: '10:30 - 12:30', courseName: 'Database Systems', courseCode: 'CS301', lecturerName: 'Prof. Sarah Chen', classroom: 'Lab B202' },
    { id: '3', day: 'Tuesday', time: '08:00 - 10:00', courseName: 'Operating Systems', courseCode: 'CS302', lecturerName: 'Dr. Michael Brown', classroom: 'Room A103' },
    { id: '4', day: 'Tuesday', time: '14:00 - 16:00', courseName: 'Web Development', courseCode: 'CS205', lecturerName: 'Ms. Emily Davis', classroom: 'Lab C101' },
    { id: '5', day: 'Wednesday', time: '10:30 - 12:30', courseName: 'Algorithms', courseCode: 'CS202', lecturerName: 'Dr. James Wilson', classroom: 'Room A101' },
    { id: '6', day: 'Wednesday', time: '14:00 - 16:00', courseName: 'Computer Networks', courseCode: 'CS303', lecturerName: 'Prof. Robert Lee', classroom: 'Room B105' },
    { id: '7', day: 'Thursday', time: '08:00 - 10:00', courseName: 'Software Engineering', courseCode: 'CS304', lecturerName: 'Dr. Lisa Anderson', classroom: 'Room A102' },
    { id: '8', day: 'Thursday', time: '10:30 - 12:30', courseName: 'Database Systems', courseCode: 'CS301', lecturerName: 'Prof. Sarah Chen', classroom: 'Lab B202' },
    { id: '9', day: 'Friday', time: '08:00 - 10:00', courseName: 'Data Structures', courseCode: 'CS201', lecturerName: 'Dr. James Wilson', classroom: 'Room A101' },
    { id: '10', day: 'Friday', time: '14:00 - 16:00', courseName: 'Project Work', courseCode: 'CS400', lecturerName: 'Dr. Lisa Anderson', classroom: 'Lab C102' },
  ],
  'BSc Information Technology': [
    { id: '11', day: 'Monday', time: '10:30 - 12:30', courseName: 'IT Fundamentals', courseCode: 'IT101', lecturerName: 'Mr. David Kim', classroom: 'Room B101' },
    { id: '12', day: 'Monday', time: '14:00 - 16:00', courseName: 'Network Administration', courseCode: 'IT201', lecturerName: 'Prof. Robert Lee', classroom: 'Lab A201' },
    { id: '13', day: 'Tuesday', time: '08:00 - 10:00', courseName: 'System Analysis', courseCode: 'IT202', lecturerName: 'Dr. Jennifer White', classroom: 'Room B102' },
    { id: '14', day: 'Wednesday', time: '08:00 - 10:00', courseName: 'IT Fundamentals', courseCode: 'IT101', lecturerName: 'Mr. David Kim', classroom: 'Room B101' },
    { id: '15', day: 'Thursday', time: '10:30 - 12:30', courseName: 'Cloud Computing', courseCode: 'IT301', lecturerName: 'Prof. Sarah Chen', classroom: 'Lab B203' },
    { id: '16', day: 'Friday', time: '10:30 - 12:30', courseName: 'IT Project Management', courseCode: 'IT302', lecturerName: 'Dr. Jennifer White', classroom: 'Room B104' },
  ],
  'BSc Software Engineering': [
    { id: '17', day: 'Monday', time: '08:00 - 10:00', courseName: 'Software Design', courseCode: 'SE201', lecturerName: 'Dr. Lisa Anderson', classroom: 'Room C101' },
    { id: '18', day: 'Tuesday', time: '10:30 - 12:30', courseName: 'Agile Methodologies', courseCode: 'SE202', lecturerName: 'Mr. Thomas Green', classroom: 'Room C102' },
    { id: '19', day: 'Wednesday', time: '14:00 - 16:00', courseName: 'Software Testing', courseCode: 'SE301', lecturerName: 'Dr. Michael Brown', classroom: 'Lab C103' },
    { id: '20', day: 'Thursday', time: '08:00 - 10:00', courseName: 'Software Architecture', courseCode: 'SE302', lecturerName: 'Prof. Sarah Chen', classroom: 'Room C101' },
    { id: '21', day: 'Friday', time: '10:30 - 12:30', courseName: 'DevOps Practices', courseCode: 'SE303', lecturerName: 'Mr. Thomas Green', classroom: 'Lab C104' },
  ],
  'BSc Data Science': [
    { id: '22', day: 'Monday', time: '10:30 - 12:30', courseName: 'Statistics for DS', courseCode: 'DS101', lecturerName: 'Prof. Emma Taylor', classroom: 'Room D101' },
    { id: '23', day: 'Tuesday', time: '14:00 - 16:00', courseName: 'Machine Learning', courseCode: 'DS201', lecturerName: 'Dr. Alex Morgan', classroom: 'Lab D201' },
    { id: '24', day: 'Wednesday', time: '08:00 - 10:00', courseName: 'Data Visualization', courseCode: 'DS202', lecturerName: 'Ms. Emily Davis', classroom: 'Lab D202' },
    { id: '25', day: 'Thursday', time: '10:30 - 12:30', courseName: 'Big Data Analytics', courseCode: 'DS301', lecturerName: 'Prof. Emma Taylor', classroom: 'Lab D203' },
    { id: '26', day: 'Friday', time: '08:00 - 10:00', courseName: 'AI Fundamentals', courseCode: 'DS302', lecturerName: 'Dr. Alex Morgan', classroom: 'Room D102' },
  ],
  'BSc Cyber Security': [
    { id: '27', day: 'Monday', time: '14:00 - 16:00', courseName: 'Security Fundamentals', courseCode: 'CY101', lecturerName: 'Dr. Kevin Park', classroom: 'Room E101' },
    { id: '28', day: 'Tuesday', time: '08:00 - 10:00', courseName: 'Ethical Hacking', courseCode: 'CY201', lecturerName: 'Mr. Ryan Scott', classroom: 'Lab E201' },
    { id: '29', day: 'Wednesday', time: '10:30 - 12:30', courseName: 'Cryptography', courseCode: 'CY202', lecturerName: 'Prof. Robert Lee', classroom: 'Room E102' },
    { id: '30', day: 'Thursday', time: '14:00 - 16:00', courseName: 'Network Security', courseCode: 'CY301', lecturerName: 'Dr. Kevin Park', classroom: 'Lab E202' },
    { id: '31', day: 'Friday', time: '14:00 - 16:00', courseName: 'Incident Response', courseCode: 'CY302', lecturerName: 'Mr. Ryan Scott', classroom: 'Room E103' },
  ],
};

const Timetable = () => {
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedProgram, setSelectedProgram] = useState<string>('');

  const timetableData = selectedProgram ? mockTimetableData[selectedProgram] || [] : [];

  const getEntriesForDay = (day: string) => {
    return timetableData.filter((entry) => entry.day === day);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                Student Timetable
              </h1>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                View your weekly class schedule. Select your academic year and degree programme to see classroom allocations.
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="border-b border-border bg-card py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <label className="text-sm font-medium text-foreground">Academic Year:</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    {academicYears.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <label className="text-sm font-medium text-foreground">Degree Programme:</label>
                <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                  <SelectTrigger className="w-full sm:w-[250px]">
                    <SelectValue placeholder="Select Programme" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    {degreePrograms.map((program) => (
                      <SelectItem key={program} value={program}>
                        {program}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Timetable */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {!selectedYear || !selectedProgram ? (
              <Card className="mx-auto max-w-lg border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold text-foreground">Select Your Options</h3>
                  <p className="text-center text-sm text-muted-foreground">
                    Please select both academic year and degree programme to view your timetable.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">
                    Weekly Schedule - {selectedProgram}
                  </h2>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    {selectedYear}
                  </span>
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block">
                  <Card>
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="w-[120px] font-semibold">Day</TableHead>
                          <TableHead className="w-[140px] font-semibold">Time</TableHead>
                          <TableHead className="font-semibold">Course</TableHead>
                          <TableHead className="font-semibold">Lecturer</TableHead>
                          <TableHead className="font-semibold">Classroom</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {days.map((day) => {
                          const entries = getEntriesForDay(day);
                          if (entries.length === 0) {
                            return (
                              <TableRow key={day}>
                                <TableCell className="font-medium text-foreground">{day}</TableCell>
                                <TableCell colSpan={4} className="text-center text-muted-foreground">
                                  No classes scheduled
                                </TableCell>
                              </TableRow>
                            );
                          }
                          return entries.map((entry, index) => (
                            <TableRow key={entry.id}>
                              {index === 0 && (
                                <TableCell
                                  rowSpan={entries.length}
                                  className="border-r font-medium text-foreground"
                                >
                                  {day}
                                </TableCell>
                              )}
                              <TableCell className="text-sm">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  {entry.time}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <span className="font-medium text-foreground">{entry.courseName}</span>
                                  <span className="ml-2 text-xs text-muted-foreground">({entry.courseCode})</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  {entry.lecturerName}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-sm font-medium text-primary">
                                    {entry.classroom}
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ));
                        })}
                      </TableBody>
                    </Table>
                  </Card>
                </div>

                {/* Mobile Card View */}
                <div className="space-y-4 lg:hidden">
                  {days.map((day) => {
                    const entries = getEntriesForDay(day);
                    return (
                      <Card key={day}>
                        <CardHeader className="bg-muted/50 py-3">
                          <CardTitle className="text-base font-semibold">{day}</CardTitle>
                        </CardHeader>
                        <CardContent className="divide-y divide-border p-0">
                          {entries.length === 0 ? (
                            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                              No classes scheduled
                            </p>
                          ) : (
                            entries.map((entry) => (
                              <div key={entry.id} className="p-4">
                                <div className="mb-2 flex items-center justify-between">
                                  <span className="font-medium text-foreground">{entry.courseName}</span>
                                  <span className="text-xs text-muted-foreground">{entry.courseCode}</span>
                                </div>
                                <div className="space-y-1.5 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    {entry.time}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    {entry.lecturerName}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-sm font-medium text-primary">
                                      {entry.classroom}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Timetable;
