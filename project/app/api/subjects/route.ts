import { NextRequest, NextResponse } from 'next/server';
import { subjectStore } from '@/lib/subject-store';
import { validateSubject, checkRateLimit, getSecurityHeaders } from '@/lib/security';
import { CreateSubjectRequest } from '@/types/subject';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET /api/subjects - Get all subjects with optional filtering and pagination
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

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const department = searchParams.get('department') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { success: false, error: 'Invalid pagination parameters' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const filters = { search, department };
    const { subjects, total } = subjectStore.getAllSubjects(filters, page, limit);

    return NextResponse.json(
      {
        success: true,
        data: {
          subjects,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('GET /api/subjects error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// POST /api/subjects - Create new subject
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip || 'unknown';
    if (!checkRateLimit(ip, 20)) { // Stricter limit for POST requests
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const body: CreateSubjectRequest = await request.json();

    // Validate input
    const validation = validateSubject(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.errors },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Create subject
    const newSubject = subjectStore.createSubject(body);

    return NextResponse.json(
      {
        success: true,
        data: newSubject,
        message: 'Subject created successfully',
      },
      { status: 201, headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('POST /api/subjects error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}