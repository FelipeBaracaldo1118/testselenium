import { NextRequest, NextResponse } from 'next/server';
import { subjectStore } from '@/lib/subject-store';
import { validateSubject, checkRateLimit, getSecurityHeaders } from '@/lib/security';
import { UpdateSubjectRequest } from '@/types/subject';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/subjects/[id] - Get specific subject
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Rate limiting
    const ip = request.ip || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const subjectId = params.id;
    const subject = subjectStore.getSubjectById(subjectId);

    if (!subject) {
      return NextResponse.json(
        { success: false, error: 'Subject not found' },
        { status: 404, headers: getSecurityHeaders() }
      );
    }

    return NextResponse.json(
      { success: true, data: subject },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error(`GET /api/subjects/${params.id} error:`, error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// PUT /api/subjects/[id] - Update specific subject
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Rate limiting
    const ip = request.ip || 'unknown';
    if (!checkRateLimit(ip, 30)) { // Moderate limit for PUT requests
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const subjectId = params.id;
    const body = await request.json();

    // Validate input
    const validation = validateSubject(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.errors },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const updateData: UpdateSubjectRequest = {
      subjectId,
      ...body,
    };

    // Update subject
    const updatedSubject = subjectStore.updateSubject(updateData);

    if (!updatedSubject) {
      return NextResponse.json(
        { success: false, error: 'Subject not found' },
        { status: 404, headers: getSecurityHeaders() }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedSubject,
        message: 'Subject updated successfully',
      },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error(`PUT /api/subjects/${params.id} error:`, error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

// DELETE /api/subjects/[id] - Delete specific subject
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Rate limiting
    const ip = request.ip || 'unknown';
    if (!checkRateLimit(ip, 20)) { // Stricter limit for DELETE requests
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429, headers: getSecurityHeaders() }
      );
    }

    const subjectId = params.id;

    // Check if subject exists
    const existingSubject = subjectStore.getSubjectById(subjectId);
    if (!existingSubject) {
      return NextResponse.json(
        { success: false, error: 'Subject not found' },
        { status: 404, headers: getSecurityHeaders() }
      );
    }

    // Delete subject
    const deleted = subjectStore.deleteSubject(subjectId);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete subject' },
        { status: 500, headers: getSecurityHeaders() }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Subject deleted successfully',
      },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error(`DELETE /api/subjects/${params.id} error:`, error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}