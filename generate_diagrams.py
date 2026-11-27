import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Ellipse, ArrowStyle

OUT_DIR = r"C:\Users\Prince Darji\.gemini\antigravity\scratch\i-careplus\diagrams"
os.makedirs(OUT_DIR, exist_ok=True)

# -------------------------------------------------------------------------
# 1. USE CASE DIAGRAM
# -------------------------------------------------------------------------
def generate_use_case_diagram():
    fig, ax = plt.subplots(figsize=(16, 11), dpi=220)
    ax.set_facecolor('#F8FAFC')
    fig.patch.set_facecolor('#F8FAFC')
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 11)
    ax.axis('off')

    # Title
    ax.text(8, 10.5, "i_CarePlus - UML Use Case Diagram", fontsize=20, fontweight='bold', 
            ha='center', color='#123B5D', family='sans-serif')
    ax.text(8, 10.15, "Hospital Management System Core Actors and Use Cases", fontsize=11, 
            ha='center', color='#0EA5A4', style='italic', family='sans-serif')

    # System Boundary Box
    sys_box = FancyBboxPatch((3.2, 0.4), 9.6, 9.4, boxstyle="round,pad=0.2,rounding_size=0.15",
                             facecolor='#FFFFFF', edgecolor='#123B5D', linewidth=2.5, linestyle='-')
    ax.add_patch(sys_box)
    ax.text(8, 9.55, "System Boundary: i_CarePlus Application Core", fontsize=12, fontweight='bold',
            ha='center', color='#123B5D', bbox=dict(boxstyle='square,pad=0.3', facecolor='#E2E8F0', edgecolor='none'))

    # Helper function for Actor
    def draw_actor(x, y, name, color='#123B5D'):
        # Head
        head = plt.Circle((x, y + 0.45), 0.16, color=color, fill=False, linewidth=2.2)
        ax.add_patch(head)
        # Body
        ax.plot([x, x], [y + 0.29, y - 0.15], color=color, linewidth=2.2)
        # Arms
        ax.plot([x - 0.25, x + 0.25], [y + 0.15, y + 0.15], color=color, linewidth=2.2)
        # Legs
        ax.plot([x, x - 0.2], [y - 0.15, y - 0.55], color=color, linewidth=2.2)
        ax.plot([x, x + 0.2], [y - 0.15, y - 0.55], color=color, linewidth=2.2)
        # Name
        ax.text(x, y - 0.78, name, fontsize=12, fontweight='bold', ha='center', color=color)

    # Draw Actors
    draw_actor(1.5, 6.2, "Patient\n(Primary Actor)", '#0EA5A4')
    draw_actor(14.5, 7.8, "Doctor\n(Specialist)", '#123B5D')
    draw_actor(14.5, 3.2, "Hospital Admin\n(Executive)", '#DC2626')

    # Use Cases definition: (name, x, y, width, height)
    use_cases = [
        ("Register & Login\n(JWT Authentication)", 5.2, 8.6, 2.8, 0.7),
        ("Browse Doctors &\nSpecialties", 5.2, 7.4, 2.7, 0.65),
        ("Book Appointment Slot\n(Live Doctor Schedule)", 5.2, 6.1, 2.9, 0.7),
        ("Check Slot Collision\n<<include>>", 8.8, 6.1, 2.6, 0.6),
        ("View My Appointments &\nStatus Tracking", 5.2, 4.8, 2.8, 0.65),
        ("Access Electronic Medical\nRecords (EMR)", 5.2, 3.5, 2.8, 0.65),
        ("View & Print Digital\nPrescription", 5.2, 2.2, 2.7, 0.65),
        ("Simulate Invoice Payment\n(Demo Checkout)", 5.2, 1.0, 2.8, 0.65),

        ("Record Diagnosis &\nClinical Notes", 10.8, 8.2, 2.7, 0.65),
        ("Issue Digital\nPrescription", 10.8, 7.0, 2.5, 0.65),

        ("Manage Doctors &\nSchedules (CRUD)", 10.8, 4.2, 2.7, 0.65),
        ("Manage Medical\nDepartments", 10.8, 3.0, 2.6, 0.6),
        ("Hospital KPI Analytics &\nReports (Recharts)", 10.8, 1.8, 2.8, 0.7),
    ]

    uc_centers = {}
    for text, cx, cy, w, h in use_cases:
        ellipse = Ellipse((cx, cy), w, h, facecolor='#F0FDFA' if cx < 8 else '#EFF6FF', 
                          edgecolor='#0EA5A4' if cx < 8 else '#123B5D', linewidth=1.8)
        ax.add_patch(ellipse)
        ax.text(cx, cy, text, fontsize=9.5, ha='center', va='center', color='#1E293B', fontweight='semibold')
        uc_centers[text.split('\n')[0]] = (cx, cy)

    # Connections from Patient (1.5, 6.2)
    p_conn = ["Register & Login", "Browse Doctors &", "Book Appointment Slot", 
              "View My Appointments &", "Access Electronic Medical", "View & Print Digital", "Simulate Invoice Payment"]
    for target in p_conn:
        tx, ty = uc_centers[target]
        ax.annotate("", xy=(tx - 1.3, ty), xytext=(1.75, 6.2),
                    arrowprops=dict(arrowstyle="-", color='#0EA5A4', lw=1.5, alpha=0.85))

    # Include connection from Book Appointment to Check Collision
    ax.annotate("<<include>>", xy=(7.5, 6.1), xytext=(6.65, 6.1),
                arrowprops=dict(arrowstyle="->", color='#E11D48', lw=1.6, linestyle='dashed'),
                fontsize=8.5, fontweight='bold', color='#E11D48', va='bottom', ha='center')

    # Connections from Doctor (14.5, 7.8)
    d_conn = ["Record Diagnosis &", "Issue Digital", "View My Appointments &"]
    for target in d_conn:
        tx, ty = uc_centers[target]
        end_x = tx + 1.3 if tx < 10 else tx + 1.25
        ax.annotate("", xy=(end_x, ty), xytext=(14.25, 7.8),
                    arrowprops=dict(arrowstyle="-", color='#123B5D', lw=1.5, alpha=0.85))

    # Connections from Admin (14.5, 3.2)
    a_conn = ["Manage Doctors &", "Manage Medical", "Hospital KPI Analytics &", "View My Appointments &"]
    for target in a_conn:
        tx, ty = uc_centers[target]
        end_x = tx + 1.3 if tx < 10 else tx + 1.3
        ax.annotate("", xy=(end_x, ty), xytext=(14.25, 3.2),
                    arrowprops=dict(arrowstyle="-", color='#DC2626', lw=1.5, alpha=0.85))

    plt.tight_layout()
    path = os.path.join(OUT_DIR, "use_case_diagram.png")
    plt.savefig(path, dpi=220, bbox_inches='tight')
    plt.close()
    print("Generated:", path)

# -------------------------------------------------------------------------
# 2. CLASS DIAGRAM
# -------------------------------------------------------------------------
def generate_class_diagram():
    fig, ax = plt.subplots(figsize=(18, 12), dpi=220)
    ax.set_facecolor('#F8FAFC')
    fig.patch.set_facecolor('#F8FAFC')
    ax.set_xlim(0, 18)
    ax.set_ylim(0, 12)
    ax.axis('off')

    ax.text(9, 11.6, "i_CarePlus - UML Class Diagram", fontsize=20, fontweight='bold', 
            ha='center', color='#123B5D')
    ax.text(9, 11.25, "Relational Entity Class Model & Database Architecture (Prisma ORM)", 
            fontsize=11, ha='center', color='#0EA5A4', style='italic')

    def draw_uml_class(x, y, w, h, name, attributes, methods, header_bg='#123B5D'):
        # Outer box
        rect = FancyBboxPatch((x, y), w, h, boxstyle="square,pad=0.0",
                              facecolor='#FFFFFF', edgecolor='#334155', linewidth=1.5)
        ax.add_patch(rect)
        # Header banner
        header_h = 0.55
        h_rect = FancyBboxPatch((x, y + h - header_h), w, header_h, boxstyle="square,pad=0.0",
                                facecolor=header_bg, edgecolor='#334155', linewidth=1.5)
        ax.add_patch(h_rect)
        ax.text(x + w/2, y + h - header_h/2, name, fontsize=11, fontweight='bold', 
                color='#FFFFFF', ha='center', va='center')

        # Attributes section
        attr_y = y + h - header_h - 0.22
        for attr in attributes:
            ax.text(x + 0.15, attr_y, attr, fontsize=8.5, color='#1E293B', fontfamily='monospace')
            attr_y -= 0.22

        # Divider line
        div_y = y + len(methods) * 0.22 + 0.15
        ax.plot([x, x + w], [div_y, div_y], color='#CBD5E1', linewidth=1.2)

        # Methods section
        meth_y = div_y - 0.22
        for meth in methods:
            ax.text(x + 0.15, meth_y, meth, fontsize=8.5, color='#0F766E', fontfamily='monospace')
            meth_y -= 0.22

    # Draw Classes
    # 1. User
    draw_uml_class(0.6, 7.2, 3.4, 3.6, "User", [
        "+ id: Int (PK)",
        "+ name: String",
        "+ email: String (Unique)",
        "+ password: String (Hash)",
        "+ role: Role (ADMIN/PATIENT/DOC)",
        "+ phone: String?",
        "+ status: String (ACTIVE)"
    ], [
        "+ authenticate(): Boolean",
        "+ generateToken(): String",
        "+ updateProfile(): User"
    ], '#123B5D')

    # 2. Patient
    draw_uml_class(5.0, 7.2, 3.5, 3.6, "Patient", [
        "+ id: Int (PK)",
        "+ userId: Int (FK -> User)",
        "+ dob: DateTime?",
        "+ gender: String?",
        "+ bloodGroup: String?",
        "+ address: Text?",
        "+ emergencyContact: String?"
    ], [
        "+ getAppointments(): List",
        "+ getMedicalHistory(): List",
        "+ getInvoices(): List"
    ], '#0EA5A4')

    # 3. Doctor
    draw_uml_class(9.5, 7.2, 3.6, 3.6, "Doctor", [
        "+ id: Int (PK)",
        "+ userId: Int (FK -> User)",
        "+ departmentId: Int (FK)",
        "+ qualification: String",
        "+ experience: Int",
        "+ consultationFee: Decimal",
        "+ status: String"
    ], [
        "+ updateAvailability()",
        "+ getScheduledAppointments()",
        "+ issuePrescription()"
    ], '#123B5D')

    # 4. Department
    draw_uml_class(14.0, 7.2, 3.4, 3.6, "Department", [
        "+ id: Int (PK)",
        "+ name: String (Unique)",
        "+ description: Text?",
        "+ icon: String?",
        "+ headOfDept: String?",
        "+ status: String"
    ], [
        "+ getDoctors(): List",
        "+ getAppointmentCount(): Int",
        "+ addDepartment(): Dept"
    ], '#0369A1')

    # 5. Appointment
    draw_uml_class(5.0, 1.8, 3.7, 4.2, "Appointment", [
        "+ id: Int (PK)",
        "+ appointmentNo: String (Unique)",
        "+ patientId: Int (FK -> Patient)",
        "+ doctorId: Int (FK -> Doctor)",
        "+ departmentId: Int (FK -> Dept)",
        "+ appointmentDate: DateTime",
        "+ timeSlot: String",
        "+ status: Status (Pending/Conf/Comp)",
        "+ reason: Text?"
    ], [
        "+ validateSlotAvailability(): Bool",
        "+ confirmAppointment()",
        "+ completeAppointment()",
        "+ cancelAppointment()"
    ], '#0F766E')

    # 6. MedicalRecord
    draw_uml_class(0.6, 1.8, 3.5, 4.2, "MedicalRecord", [
        "+ id: Int (PK)",
        "+ recordNo: String (Unique)",
        "+ patientId: Int (FK -> Patient)",
        "+ doctorId: Int (FK -> Doctor)",
        "+ visitDate: DateTime",
        "+ diagnosis: Text",
        "+ treatment: Text",
        "+ notes: Text?"
    ], [
        "+ createRecord(): Record",
        "+ printMedicalHistory()",
        "+ updateClinicalNotes()"
    ], '#4338CA')

    # 7. Prescription
    draw_uml_class(9.8, 1.8, 3.7, 4.2, "Prescription", [
        "+ id: Int (PK)",
        "+ prescriptionNo: String (Unique)",
        "+ appointmentId: Int (FK)",
        "+ patientId: Int (FK)",
        "+ doctorId: Int (FK)",
        "+ medicines: List<Medicines>",
        "+ instructions: Text?",
        "+ issuedDate: DateTime"
    ], [
        "+ addMedicine(dosage, freq)",
        "+ generatePrintablePDF()",
        "+ viewPrescription()"
    ], '#059669')

    # 8. Invoice & Payment
    draw_uml_class(14.2, 1.8, 3.4, 4.2, "Invoice", [
        "+ id: Int (PK)",
        "+ invoiceNo: String (Unique)",
        "+ patientId: Int (FK)",
        "+ appointmentId: Int (FK)",
        "+ amount: Decimal",
        "+ status: String (Paid/Pending)",
        "+ dueDate: DateTime"
    ], [
        "+ generateInvoice(): Invoice",
        "+ simulateDemoPayment(): Bool",
        "+ printInvoiceReceipt()"
    ], '#B91C1C')

    # Association Lines
    # User <-> Patient
    ax.annotate("", xy=(5.0, 9.0), xytext=(4.0, 9.0),
                arrowprops=dict(arrowstyle="->", lw=1.8, color='#0EA5A4'))
    ax.text(4.1, 9.15, "1", fontsize=9, fontweight='bold', color='#123B5D')
    ax.text(4.8, 9.15, "1", fontsize=9, fontweight='bold', color='#0EA5A4')

    # User <-> Doctor
    ax.annotate("", xy=(9.5, 9.0), xytext=(4.0, 9.0),
                arrowprops=dict(arrowstyle="->", lw=1.8, color='#123B5D', connectionstyle="arc3,rad=-0.15"))

    # Doctor <-> Department
    ax.annotate("", xy=(13.1, 9.0), xytext=(14.0, 9.0),
                arrowprops=dict(arrowstyle="<-", lw=1.8, color='#0369A1'))
    ax.text(13.2, 9.15, "*", fontsize=10, fontweight='bold')
    ax.text(13.8, 9.15, "1", fontsize=9, fontweight='bold')

    # Patient -> Appointment
    ax.annotate("", xy=(6.8, 6.0), xytext=(6.8, 7.2),
                arrowprops=dict(arrowstyle="->", lw=1.8, color='#0F766E'))
    ax.text(7.0, 7.0, "1", fontsize=9, fontweight='bold')
    ax.text(7.0, 6.2, "*", fontsize=10, fontweight='bold')

    # Doctor -> Appointment
    ax.annotate("", xy=(8.7, 4.5), xytext=(9.5, 7.2),
                arrowprops=dict(arrowstyle="->", lw=1.8, color='#123B5D'))

    # Appointment -> Prescription
    ax.annotate("", xy=(9.8, 3.8), xytext=(8.7, 3.8),
                arrowprops=dict(arrowstyle="->", lw=1.8, color='#059669'))
    ax.text(8.8, 3.95, "1", fontsize=9, fontweight='bold')
    ax.text(9.6, 3.95, "0..1", fontsize=9, fontweight='bold')

    # Appointment -> Invoice
    ax.annotate("", xy=(14.2, 3.8), xytext=(13.5, 3.8),
                arrowprops=dict(arrowstyle="->", lw=1.8, color='#B91C1C'))

    # Patient -> MedicalRecord
    ax.annotate("", xy=(4.1, 3.8), xytext=(5.0, 3.8),
                arrowprops=dict(arrowstyle="<-", lw=1.8, color='#4338CA'))

    plt.tight_layout()
    path = os.path.join(OUT_DIR, "class_diagram.png")
    plt.savefig(path, dpi=220, bbox_inches='tight')
    plt.close()
    print("Generated:", path)

# -------------------------------------------------------------------------
# 3. INTERACTION / SEQUENCE DIAGRAM
# -------------------------------------------------------------------------
def generate_interaction_diagram():
    fig, ax = plt.subplots(figsize=(16, 11), dpi=220)
    ax.set_facecolor('#F8FAFC')
    fig.patch.set_facecolor('#F8FAFC')
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 11)
    ax.axis('off')

    ax.text(8, 10.5, "i_CarePlus - UML Interaction / Sequence Diagram", fontsize=19, fontweight='bold', 
            ha='center', color='#123B5D')
    ax.text(8, 10.15, "Sequence Flow: Atomic Patient Appointment Booking & Collision Prevention", 
            fontsize=11, ha='center', color='#0EA5A4', style='italic')

    # Lifelines
    actors = [
        ("Patient (Browser)", 2.0, '#0EA5A4'),
        ("AuthGuard (JWT)", 5.2, '#123B5D'),
        ("AppointmentController", 8.5, '#0F766E'),
        ("Prisma ORM", 11.5, '#4338CA'),
        ("MySQL DB (TiDB)", 14.5, '#1E293B')
    ]

    for name, x, col in actors:
        # Header box
        h_box = FancyBboxPatch((x - 1.2, 9.2), 2.4, 0.65, boxstyle="round,pad=0.1",
                               facecolor=col, edgecolor='#1E293B', linewidth=1.5)
        ax.add_patch(h_box)
        ax.text(x, 9.52, name, fontsize=9.5, fontweight='bold', color='#FFFFFF', ha='center', va='center')
        # Lifeline dashed line
        ax.plot([x, x], [0.8, 9.2], color='#94A3B8', linestyle='--', linewidth=1.5)

    def draw_msg(y, x1, x2, text, is_reply=False, is_error=False, color=None):
        if color is None:
            color = '#DC2626' if is_error else ('#64748B' if is_reply else '#0F172A')
        style = "--" if is_reply else "-"
        arr_style = "->" if not is_reply else "->"
        ax.annotate("", xy=(x2, y), xytext=(x1, y),
                    arrowprops=dict(arrowstyle=arr_style, color=color, lw=1.6, linestyle=style))
        mid_x = (x1 + x2) / 2
        ax.text(mid_x, y + 0.12, text, fontsize=8.5, fontweight='bold' if not is_reply else 'normal',
                ha='center', color=color, bbox=dict(boxstyle='square,pad=0.15', facecolor='#FFFFFF', edgecolor='none', alpha=0.9))

    # Messages Flow
    draw_msg(8.5, 2.0, 5.2, "1: POST /api/appointments { doctorId, date, timeSlot } + Bearer Token")
    draw_msg(8.0, 5.2, 5.2 + 0.6, "2: verifyToken(token)")
    draw_msg(7.4, 5.2, 8.5, "3: forwardReqWithUser(req.user.id)")

    draw_msg(6.7, 8.5, 11.5, "4: prisma.appointment.findFirst({ doctorId, date, timeSlot })")
    draw_msg(6.1, 11.5, 14.5, "5: SELECT * FROM appointments WHERE slot AND status != 'Cancelled'")
    draw_msg(5.5, 14.5, 11.5, "6: Return Matching Rows (Count)", is_reply=True)
    draw_msg(4.9, 11.5, 8.5, "7: existingAppointment Result", is_reply=True)

    # Alternate Frame (Condition)
    alt_box = FancyBboxPatch((1.0, 1.2), 14.0, 3.3, boxstyle="square,pad=0.1",
                             facecolor='#FFF1F2', edgecolor='#F43F5E', linewidth=1.5, linestyle=':')
    ax.add_patch(alt_box)
    ax.text(1.3, 4.25, "[alt: Slot Conflict vs Available Slot]", fontsize=9, fontweight='bold', color='#BE123C')

    # Condition 1: Error Branch
    ax.text(1.3, 3.8, "[Slot Already Occupied]", fontsize=8.5, fontweight='bold', color='#DC2626')
    draw_msg(3.5, 8.5, 2.0, "8a: HTTP 400 Bad Request ('Selected slot is already booked')", is_reply=True, is_error=True)

    # Divider in alt frame
    ax.plot([1.0, 15.0], [2.9, 2.9], color='#FDA4AF', linestyle='--', linewidth=1.2)

    # Condition 2: Success Branch
    ax.text(1.3, 2.65, "[Slot is Vacant -> Atomic Booking]", fontsize=8.5, fontweight='bold', color='#059669')
    draw_msg(2.4, 8.5, 11.5, "8b: prisma.appointment.create({ data: appointmentDetails })", color='#059669')
    draw_msg(1.9, 11.5, 14.5, "9b: INSERT INTO appointments ...", color='#059669')
    draw_msg(1.5, 8.5, 2.0, "10b: HTTP 201 Created { success: true, appointment: data }", is_reply=True, color='#059669')

    plt.tight_layout()
    path = os.path.join(OUT_DIR, "interaction_diagram.png")
    plt.savefig(path, dpi=220, bbox_inches='tight')
    plt.close()
    print("Generated:", path)

# -------------------------------------------------------------------------
# 4. ACTIVITY DIAGRAM
# -------------------------------------------------------------------------
def generate_activity_diagram():
    fig, ax = plt.subplots(figsize=(16, 12), dpi=220)
    ax.set_facecolor('#F8FAFC')
    fig.patch.set_facecolor('#F8FAFC')
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 12)
    ax.axis('off')

    ax.text(8, 11.6, "i_CarePlus - UML Activity Diagram", fontsize=20, fontweight='bold', 
            ha='center', color='#123B5D')
    ax.text(8, 11.25, "End-to-End Clinical Appointment Booking & Patient Care Activity Workflow", 
            fontsize=11, ha='center', color='#0EA5A4', style='italic')

    # Swimlanes
    swimlanes = [
        ("Patient Portal (Client)", 0.8, 5.0, '#F0FDFA', '#0EA5A4'),
        ("i_CarePlus Server & Engine", 5.8, 5.0, '#EFF6FF', '#123B5D'),
        ("Doctor & Clinical Workflow", 10.8, 4.6, '#F5F3FF', '#6D28D9')
    ]

    for title, x, w, bg, col in swimlanes:
        sl_rect = FancyBboxPatch((x, 0.5), w, 10.3, boxstyle="square,pad=0.0",
                                facecolor=bg, edgecolor='#CBD5E1', linewidth=1.5)
        ax.add_patch(sl_rect)
        hdr = FancyBboxPatch((x, 10.3), w, 0.5, boxstyle="square,pad=0.0",
                             facecolor=col, edgecolor='#CBD5E1', linewidth=1.5)
        ax.add_patch(hdr)
        ax.text(x + w/2, 10.55, title, fontsize=10.5, fontweight='bold', color='#FFFFFF', ha='center', va='center')

    def draw_action(x, y, text, w=3.4, h=0.6, col='#123B5D'):
        box = FancyBboxPatch((x - w/2, y - h/2), w, h, boxstyle="round,pad=0.1,rounding_size=0.15",
                             facecolor='#FFFFFF', edgecolor=col, linewidth=1.6)
        ax.add_patch(box)
        ax.text(x, y, text, fontsize=8.5, fontweight='semibold', color='#1E293B', ha='center', va='center')

    # 1. Start Node
    start_circle = plt.Circle((3.3, 9.8), 0.18, color='#123B5D')
    ax.add_patch(start_circle)
    ax.text(3.3, 10.08, "Start", fontsize=9, fontweight='bold', color='#123B5D', ha='center')

    # Patient Actions
    draw_action(3.3, 9.0, "1. Patient Login or Registration\n(Enters credentials -> Receives JWT)")
    draw_action(3.3, 8.0, "2. Browse Medical Departments\n& Filter by Specialist")
    draw_action(3.3, 7.0, "3. Select Consulting Doctor,\nDate & Available Time Slot")
    draw_action(3.3, 6.0, "4. Enter Reason for Consultation\n& Click 'Book Appointment'")

    # Connecting arrows
    ax.annotate("", xy=(3.3, 9.35), xytext=(3.3, 9.6), arrowprops=dict(arrowstyle="->", lw=1.6, color='#0EA5A4'))
    ax.annotate("", xy=(3.3, 8.35), xytext=(3.3, 8.65), arrowprops=dict(arrowstyle="->", lw=1.6, color='#0EA5A4'))
    ax.annotate("", xy=(3.3, 7.35), xytext=(3.3, 7.65), arrowprops=dict(arrowstyle="->", lw=1.6, color='#0EA5A4'))
    ax.annotate("", xy=(3.3, 6.35), xytext=(3.3, 6.65), arrowprops=dict(arrowstyle="->", lw=1.6, color='#0EA5A4'))

    # Arrow to server
    ax.annotate("", xy=(6.5, 6.0), xytext=(5.0, 6.0), arrowprops=dict(arrowstyle="->", lw=1.8, color='#123B5D'))

    # Server Actions
    draw_action(8.3, 6.0, "5. Validate Token & Execute\nAtomic Slot Check in MySQL", 3.4, 0.6)

    # Decision Diamond
    diamond = patches.RegularPolygon((8.3, 4.8), numVertices=4, radius=0.65, orientation=0,
                                     facecolor='#FEF3C7', edgecolor='#D97706', linewidth=1.8)
    ax.add_patch(diamond)
    ax.text(8.3, 4.8, "Slot\nAvailable?", fontsize=8, fontweight='bold', ha='center', va='center')

    ax.annotate("", xy=(8.3, 5.45), xytext=(8.3, 5.7), arrowprops=dict(arrowstyle="->", lw=1.6, color='#123B5D'))

    # Decision branches
    # Branch NO: Slot booked
    ax.annotate("No (Occupied)", xy=(3.3, 5.65), xytext=(7.6, 4.8),
                arrowprops=dict(arrowstyle="->", lw=1.6, color='#DC2626', connectionstyle="arc3,rad=0.3"),
                fontsize=8, fontweight='bold', color='#DC2626')

    # Branch YES: Slot free
    ax.annotate("Yes (Vacant)", xy=(8.3, 3.75), xytext=(8.3, 4.15),
                arrowprops=dict(arrowstyle="->", lw=1.6, color='#059669'),
                fontsize=8.5, fontweight='bold', color='#059669', ha='right')

    draw_action(8.3, 3.4, "6. Insert Appointment Record (Status: Confirmed)\n& Generate Patient Invoice in MySQL", 3.6, 0.65)

    # Branch to Doctor & Patient
    ax.annotate("", xy=(3.3, 2.7), xytext=(6.5, 3.4), arrowprops=dict(arrowstyle="->", lw=1.6, color='#0EA5A4'))
    ax.annotate("", xy=(13.1, 3.4), xytext=(10.1, 3.4), arrowprops=dict(arrowstyle="->", lw=1.6, color='#6D28D9'))

    draw_action(3.3, 2.4, "7. Appointment Confirmed Card\n& Real-time Status Badge Displayed", 3.4, 0.6)
    draw_action(13.1, 3.4, "8. Doctor Reviews Appointment\nSchedule & Patient Profile", 3.4, 0.6)

    draw_action(13.1, 2.2, "9. Consultation Completed:\nDoctor Logs EMR & Issues Prescription", 3.4, 0.65)
    ax.annotate("", xy=(13.1, 2.55), xytext=(13.1, 3.05), arrowprops=dict(arrowstyle="->", lw=1.6, color='#6D28D9'))

    draw_action(3.3, 1.2, "10. Patient Downloads Printable Prescription\n& Settles Bill via Demo Payment", 3.6, 0.65)
    ax.annotate("", xy=(5.1, 1.2), xytext=(11.4, 2.2), arrowprops=dict(arrowstyle="->", lw=1.6, color='#0EA5A4'))

    # End Node
    end_outer = plt.Circle((8.3, 1.2), 0.22, color='#123B5D', fill=False, lw=2.2)
    end_inner = plt.Circle((8.3, 1.2), 0.14, color='#123B5D', fill=True)
    ax.add_patch(end_outer)
    ax.add_patch(end_inner)
    ax.text(8.3, 0.78, "Process End", fontsize=9, fontweight='bold', color='#123B5D', ha='center')

    ax.annotate("", xy=(8.05, 1.2), xytext=(6.9, 1.2), arrowprops=dict(arrowstyle="->", lw=1.6, color='#123B5D'))

    plt.tight_layout()
    path = os.path.join(OUT_DIR, "activity_diagram.png")
    plt.savefig(path, dpi=220, bbox_inches='tight')
    plt.close()
    print("Generated:", path)

# -------------------------------------------------------------------------
# 5. DATA DICTIONARY DIAGRAM
# -------------------------------------------------------------------------
def generate_data_dictionary_diagram():
    fig, ax = plt.subplots(figsize=(18, 13), dpi=220)
    ax.set_facecolor('#FFFFFF')
    fig.patch.set_facecolor('#FFFFFF')
    ax.axis('off')

    plt.suptitle("i_CarePlus - Relational Data Dictionary Specification", 
                 fontsize=18, fontweight='bold', color='#123B5D', y=0.98)
    plt.title("Schema Architecture, Primary Keys, Foreign Keys, Datatypes & Constraints (MySQL / TiDB Cloud)", 
              fontsize=10.5, color='#0EA5A4', style='italic', pad=15)

    tables_data = [
        # Table 1: users
        ("Table: users (User Authentication & RBAC Core)", [
            ["Column Name", "Data Type", "Key", "Null", "Default", "Description"],
            ["id", "INT", "PK", "NO", "AUTO_INCREMENT", "Unique primary user identifier"],
            ["name", "VARCHAR(191)", "-", "NO", "-", "Full legal name of the user"],
            ["email", "VARCHAR(191)", "UK", "NO", "-", "Unique authentication email address"],
            ["password", "VARCHAR(191)", "-", "NO", "-", "bcrypt salted password hash (10 rounds)"],
            ["role", "VARCHAR(50)", "-", "NO", "'PATIENT'", "Role: 'ADMIN', 'PATIENT', 'DOCTOR'"],
            ["phone", "VARCHAR(50)", "-", "YES", "NULL", "Contact telephone / mobile number"],
            ["status", "VARCHAR(50)", "-", "NO", "'ACTIVE'", "Account state: 'ACTIVE', 'INACTIVE'"]
        ], 0.88),

        # Table 2: appointments
        ("Table: appointments (Clinical Consultation Bookings)", [
            ["Column Name", "Data Type", "Key", "Null", "Default", "Description"],
            ["id", "INT", "PK", "NO", "AUTO_INCREMENT", "Unique internal appointment ID"],
            ["appointmentNo", "VARCHAR(191)", "UK", "NO", "-", "Business tracking code (e.g., APT-2026-001)"],
            ["patientId", "INT", "FK", "NO", "-", "References patients.id (Consulting patient)"],
            ["doctorId", "INT", "FK", "NO", "-", "References doctors.id (Consulting physician)"],
            ["appointmentDate", "DATETIME(3)", "-", "NO", "-", "Calendar consultation date"],
            ["timeSlot", "VARCHAR(50)", "-", "NO", "-", "Reserved consultation slot (e.g., '10:00 AM')"],
            ["status", "VARCHAR(50)", "-", "NO", "'Pending'", "'Pending', 'Confirmed', 'Completed', 'Cancelled'"]
        ], 0.58),

        # Table 3: invoices
        ("Table: invoices (Patient Billing & Invoices)", [
            ["Column Name", "Data Type", "Key", "Null", "Default", "Description"],
            ["id", "INT", "PK", "NO", "AUTO_INCREMENT", "Unique internal invoice ID"],
            ["invoiceNo", "VARCHAR(191)", "UK", "NO", "-", "Invoice tracking reference (e.g., INV-2026-001)"],
            ["patientId", "INT", "FK", "NO", "-", "References patients.id (Billed patient)"],
            ["appointmentId", "INT", "FK", "YES", "NULL", "Associated appointment consultation"],
            ["amount", "DECIMAL(10,2)", "-", "NO", "-", "Total billing amount in currency units"],
            ["status", "VARCHAR(50)", "-", "NO", "'Pending'", "'Paid', 'Pending', 'Overdue'"],
            ["issueDate", "DATETIME(3)", "-", "NO", "CURRENT_TIMESTAMP", "Date and time invoice was generated"]
        ], 0.28)
    ]

    for title, rows, y_pos in tables_data:
        # Title text
        fig.text(0.08, y_pos + 0.045, title, fontsize=11, fontweight='bold', color='#123B5D')
        
        # Render Table
        t = plt.table(cellText=rows[1:], colLabels=rows[0],
                      bbox=[0.08, y_pos - 0.22, 0.84, 0.25],
                      cellLoc='left', colLoc='left')
        
        t.auto_set_font_size(False)
        t.set_fontsize(8.5)
        
        # Header cell styling
        for col_idx in range(len(rows[0])):
            cell = t[(0, col_idx)]
            cell.set_facecolor('#123B5D')
            cell.set_text_props(color='#FFFFFF', weight='bold')
            cell.set_height(0.035)

        # Body cell styling
        for r_idx in range(1, len(rows)):
            for col_idx in range(len(rows[0])):
                cell = t[(r_idx, col_idx)]
                bg = '#F8FAFC' if r_idx % 2 == 1 else '#FFFFFF'
                # Highlight PK/FK
                if col_idx == 2:
                    val = rows[r_idx][col_idx]
                    if val == 'PK':
                        cell.set_facecolor('#FEF3C7')
                        cell.set_text_props(color='#92400E', weight='bold')
                    elif val in ['FK', 'UK']:
                        cell.set_facecolor('#CCFBF1')
                        cell.set_text_props(color='#0F766E', weight='bold')
                    else:
                        cell.set_facecolor(bg)
                else:
                    cell.set_facecolor(bg)
                    cell.set_text_props(color='#334155')

    path = os.path.join(OUT_DIR, "data_dictionary.png")
    plt.savefig(path, dpi=220, bbox_inches='tight')
    plt.close()
    print("Generated:", path)

if __name__ == "__main__":
    print("Generating all 5 UML & Software Engineering diagrams...")
    generate_use_case_diagram()
    generate_class_diagram()
    generate_interaction_diagram()
    generate_activity_diagram()
    generate_data_dictionary_diagram()
    print("All diagrams generated successfully!")
