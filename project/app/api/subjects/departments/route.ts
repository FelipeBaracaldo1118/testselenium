import { NextRequest, NextResponse } from 'next/server';
import { subjectStore } from '@/lib/subject-store';
import { checkRateLimit, getSecurityHeaders } from '@/lib/security';

// GET /api/subjects/departments - Get all unique departments
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const departments = subjectStore.getDepartments();

    return NextResponse.json(
      {
        success: true,
        data: departments,
      },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('GET /api/subjects/departments error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}