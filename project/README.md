# Subject Management System

A comprehensive Next.js CRUD application for managing academic subjects and courses with robust security features and comprehensive Selenium testing.

## 🚀 Features

### Core Functionality
- **Complete CRUD Operations**: Create, Read, Update, and Delete subjects
- **Advanced Search & Filtering**: Search by name, professor, or description; filter by department
- **Pagination**: Efficient handling of large datasets with responsive pagination
- **Form Validation**: Real-time validation with comprehensive error handling
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Subject Entity Fields
- `subjectId`: Unique identifier (auto-generated)
- `subjectName`: Subject/course name
- `credits`: Number of credits (1-10)
- `professor`: Professor name
- `department`: Academic department
- `description`: Detailed course description

### Security Features
- **Input Sanitization**: XSS prevention using DOMPurify
- **Rate Limiting**: API endpoint protection against abuse
- **CSRF Protection**: Cross-site request forgery prevention
- **Security Headers**: Comprehensive security headers implementation
- **Data Validation**: Server-side and client-side validation

### Testing
- **Comprehensive Selenium Test Suite**: 10 automated test cases covering all functionality
- **Test Coverage**: Create, edit, delete, search, filter, pagination, validation, and error handling
- **Automated Reporting**: HTML and JSON test reports with detailed results

## 🛠️ Technology Stack

- **Frontend**: Next.js 13, React, TypeScript
- **UI Components**: shadcn/ui, Radix UI, Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Axios with interceptors
- **Testing**: Selenium WebDriver
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd subject-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🧪 Running Tests

### Prerequisites
- Chrome browser installed
- Development server running (`npm run dev`)

### Run Selenium Tests
```bash
# Run all test cases
npm run test:selenium

# Run with visible browser (non-headless)
HEADLESS=false npm run test:selenium
```

### Test Cases Covered
1. **Create new subject successfully**
2. **Validate required fields on create**
3. **Edit existing subject**
4. **Delete subject with confirmation**
5. **Search subjects by name**
6. **Filter subjects by department**
7. **Attempt create with invalid data**
8. **Verify subject list pagination**
9. **Cancel edit operation**
10. **Verify success notifications**

### Test Reports
After running tests, reports are generated in `./test-results/`:
- `test-report.html`: Detailed HTML report with visual summary
- `test-report.json`: Machine-readable JSON report
- Screenshots of any test failures

## 🏗️ Project Structure

```
├── app/
│   ├── api/subjects/           # API endpoints
│   │   ├── route.ts           # GET, POST /api/subjects
│   │   ├── [id]/route.ts      # GET, PUT, DELETE /api/subjects/[id]
│   │   └── departments/route.ts # GET /api/subjects/departments
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main page
├── components/
│   ├── subjects/
│   │   ├── subject-list.tsx   # Subject listing component
│   │   └── subject-form.tsx   # Create/edit form component
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── api.ts                 # API service layer
│   ├── security.ts            # Security utilities
│   ├── subject-store.ts       # In-memory data store
│   └── utils.ts               # Utility functions
├── tests/selenium/
│   ├── config.js              # Test configuration
│   ├── utils/driver-manager.js # WebDriver utilities
│   ├── test-cases/            # Individual test cases
│   └── run-tests.js           # Test runner
├── types/
│   └── subject.ts             # TypeScript type definitions
└── README.md
```

## 🔒 Security Implementation

### Input Sanitization
- All user inputs are sanitized using DOMPurify
- XSS prevention through content sanitization
- SQL injection prevention through parameterized queries

### API Security
- Rate limiting: 100 requests per 15 minutes (general), stricter for write operations
- CORS configuration for cross-origin requests
- Security headers: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
- Content Security Policy implementation

### Authentication Ready
- JWT token support in API client
- CSRF token handling
- Authentication header management

## 📊 API Endpoints

### Subjects
- `GET /api/subjects` - List subjects with pagination and filtering
- `POST /api/subjects` - Create new subject
- `GET /api/subjects/[id]` - Get specific subject
- `PUT /api/subjects/[id]` - Update subject
- `DELETE /api/subjects/[id]` - Delete subject
- `GET /api/subjects/departments` - Get unique departments

### Request/Response Format
```typescript
// Create/Update Subject Request
{
  subjectName: string;
  credits: number;
  professor: string;
  department: string;
  description: string;
}

// API Response Format
{
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}
```

## 🎨 Design Features

### Modern UI/UX
- Clean, professional interface using shadcn/ui components
- Consistent color system with proper contrast ratios
- Smooth animations and micro-interactions
- Responsive grid layout for subject cards

### Accessibility
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- High contrast color scheme

### Performance
- Optimized pagination for large datasets
- Efficient search and filtering
- Lazy loading and code splitting
- Minimal bundle size

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
Create a `.env.local` file:
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-domain.com
```

### Security Considerations for Production
- Enable HTTPS
- Configure proper CORS origins
- Set up rate limiting with Redis
- Implement proper authentication
- Use a real database instead of in-memory store
- Set up monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the test reports in `./test-results/` for detailed error information
2. Review the console logs for debugging information
3. Ensure all dependencies are properly installed
4. Verify that the development server is running on the correct port

## 🔮 Future Enhancements

- Database integration (PostgreSQL, MongoDB)
- User authentication and authorization
- File upload for course materials
- Email notifications
- Advanced reporting and analytics
- Mobile app development
- Integration with learning management systems