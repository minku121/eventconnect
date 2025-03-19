# TeamConnect Changelog

## Certificate Management Feature (March 19, 2025)

### Added
- Certificate management page at `/account/manage-events/[eventId]/certificates`
- API endpoints for certificate template selection, sending certificates, and downloading certificates
- UI for selecting certificate templates (4 options) and viewing issued certificates
- Notification system for alerting attendees when certificates are available
- Links from event management page to certificate management

### Features
- Event creators can select from 4 different certificate templates
- Certificates can be sent to all attendees after an event has ended
- Attendees receive notifications when certificates are available
- Event creators can view a list of all issued certificates

### Database Changes
- Added `certificateTemplateId` field to the `Event` model in Prisma schema

### Technical Notes
- NextAuth debug mode has been disabled
- The certificate download API is currently a placeholder that returns JSON data instead of a PDF
- For a production implementation, a proper PDF generation library should be integrated

## Custom Video Call UI Implementation (Previous Update)

### Fixed
- Corrected the ZegoExpressEngine initialization to use proper import and instantiation method
- Used flexible type annotations with event handlers to avoid TypeScript errors
- Updated room login process to use properly formatted token
- Added detailed logging for debugging purposes
- Implemented a simplified token generation function for development

## [Unreleased]

### Added
- Enhanced notification system:
  - Users can view all notifications in a dedicated page
  - Users can mark notifications as read
  - Users can delete notifications
  - Added notification count badge to sidebar
  - Improved notification bell component with dropdown preview

- Improved certificate functionality:
  - Certificate PDF generation using PDFKit
  - Ability to download certificates as PDF documents
  - Option to resend certificates to specific users
  - Filtering to prevent sending certificates to users who already have them
  - Added user certificates page to view and download received certificates
  - Improved UI for certificate management
