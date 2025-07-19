// Resume Builder Application
class ResumeBuilder {
    constructor() {
        this.currentSection = 'personal';
        this.resumeData = {
            personalInfo: {
                firstName: '',
                lastName: '',
                title: '',
                email: '',
                phone: '',
                location: '',
                summary: ''
            },
            experiences: [],
            education: [],
            skills: [],
            template: 'modern'
        };

        this.experienceCounter = 0;
        this.educationCounter = 0;
        this.skillCounter = 0;

        this.init();
    }

    init() {
        // Initialize Lucide icons
        this.initLucideIcons();

        // Bind event listeners
        this.bindEvents();

        // Update progress on load
        this.updateProgress();

        // Update preview
        this.updatePreview();
    }

    initLucideIcons() {
        // Initialize Lucide icons
        lucide.createIcons();
    }

    bindEvents() {
        // Progress section navigation
        document.querySelectorAll('.progress-section').forEach(section => {
            section.addEventListener('click', (e) => {
                const sectionName = e.target.closest('.progress-section').dataset.section;
                this.showSection(sectionName);
            });
        });

        // Form inputs
        document.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('input', () => {
                this.updateFromForm();
                this.updateProgress();
                this.updatePreview();
            });
        });

        // Header buttons
        document.getElementById('saveBtn').addEventListener('click', () => this.saveResume());
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadPDF());

        // AI suggestions
        document.getElementById('generateAIBtn').addEventListener('click', () => this.generateAISuggestions());

        // Template selector
        document.getElementById('templateSelect').addEventListener('change', (e) => {
            this.resumeData.template = e.target.value;
            this.updatePreview();
        });
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.form-section').forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from progress sections
        document.querySelectorAll('.progress-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        document.getElementById(`${sectionName}Section`).classList.add('active');
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Update section title
        const titles = {
            personal: 'Personal Information',
            experience: 'Work Experience',
            education: 'Education',
            skills: 'Skills'
        };
        document.getElementById('sectionTitle').textContent = titles[sectionName];

        this.currentSection = sectionName;
    }

    nextSection(sectionName) {
        this.showSection(sectionName);
    }

    previousSection(sectionName) {
        this.showSection(sectionName);
    }

    updateFromForm() {
        // Personal info
        this.resumeData.personalInfo = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            title: document.getElementById('title').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            location: document.getElementById('location').value,
            summary: document.getElementById('summary').value
        };

        // Experiences
        this.resumeData.experiences = [];
        document.querySelectorAll('.experience-item').forEach(item => {
            const exp = {
                title: item.querySelector('.exp-title').value,
                company: item.querySelector('.exp-company').value,
                startDate: item.querySelector('.exp-start').value,
                endDate: item.querySelector('.exp-end').value,
                description: item.querySelector('.exp-description').value
            };
            if (exp.title || exp.company) {
                this.resumeData.experiences.push(exp);
            }
        });

        // Education
        this.resumeData.education = [];
        document.querySelectorAll('.education-item').forEach(item => {
            const edu = {
                degree: item.querySelector('.edu-degree').value,
                institution: item.querySelector('.edu-institution').value,
                startDate: item.querySelector('.edu-start').value,
                endDate: item.querySelector('.edu-end').value
            };
            if (edu.degree || edu.institution) {
                this.resumeData.education.push(edu);
            }
        });

        // Skills
        this.resumeData.skills = [];
        document.querySelectorAll('.skill-item').forEach(item => {
            const skill = {
                category: item.querySelector('.skill-category').value,
                skills: item.querySelector('.skill-list').value.split(',').map(s => s.trim()).filter(s => s)
            };
            if (skill.category && skill.skills.length > 0) {
                this.resumeData.skills.push(skill);
            }
        });
    }

    updateProgress() {
        let completed = 0;
        const total = 4;

        // Check personal info
        const personal = this.resumeData.personalInfo;
        if (personal.firstName && personal.lastName && personal.email) {
            completed++;
            this.markSectionCompleted('personal');
        } else {
            this.markSectionIncomplete('personal');
        }

        // Check experience
        if (this.resumeData.experiences.length > 0) {
            completed++;
            this.markSectionCompleted('experience');
        } else {
            this.markSectionIncomplete('experience');
        }

        // Check education
        if (this.resumeData.education.length > 0) {
            completed++;
            this.markSectionCompleted('education');
        } else {
            this.markSectionIncomplete('education');
        }

        // Check skills
        if (this.resumeData.skills.length > 0) {
            completed++;
            this.markSectionCompleted('skills');
        } else {
            this.markSectionIncomplete('skills');
        }

        const percentage = (completed / total) * 100;
        document.getElementById('progressFill').style.width = `${percentage}%`;
        document.querySelector('.progress-text').textContent = `${Math.round(percentage)}% complete`;
    }

    markSectionCompleted(section) {
        const progressSection = document.querySelector(`[data-section="${section}"]`);
        progressSection.classList.add('completed');
        const icon = progressSection.querySelector('.progress-icon');
        icon.setAttribute('data-lucide', 'check-circle');
        this.initLucideIcons();
    }

    markSectionIncomplete(section) {
        const progressSection = document.querySelector(`[data-section="${section}"]`);
        progressSection.classList.remove('completed');
        const icon = progressSection.querySelector('.progress-icon');
        icon.setAttribute('data-lucide', 'circle');
        this.initLucideIcons();
    }

    addExperience() {
        this.experienceCounter++;
        const html = `
            <div class="item experience-item" data-id="${this.experienceCounter}">
                <div class="item-header">
                    <h5>Experience ${this.experienceCounter}</h5>
                    <div class="item-actions">
                        <button type="button" class="btn btn-sm btn-danger" onclick="removeExperience(${this.experienceCounter})">
                            <i data-lucide="trash-2"></i>
                            Remove
                        </button>
                    </div>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Job Title</label>
                        <input type="text" class="exp-title" placeholder="Software Engineer">
                    </div>
                    <div class="form-group">
                        <label>Company</label>
                        <input type="text" class="exp-company" placeholder="Tech Corp">
                    </div>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Start Date</label>
                        <input type="date" class="exp-start">
                    </div>
                    <div class="form-group">
                        <label>End Date</label>
                        <input type="date" class="exp-end">
                    </div>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea class="exp-description" rows="3" placeholder="Key responsibilities and achievements..."></textarea>
                </div>
            </div>
        `;

        document.getElementById('experienceList').insertAdjacentHTML('beforeend', html);
        this.initLucideIcons();

        // Bind events for new inputs
        const newItem = document.querySelector(`[data-id="${this.experienceCounter}"]`);
        newItem.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => {
                this.updateFromForm();
                this.updateProgress();
                this.updatePreview();
            });
        });
    }

    addEducation() {
        this.educationCounter++;
        const html = `
            <div class="item education-item" data-id="${this.educationCounter}">
                <div class="item-header">
                    <h5>Education ${this.educationCounter}</h5>
                    <div class="item-actions">
                        <button type="button" class="btn btn-sm btn-danger" onclick="removeEducation(${this.educationCounter})">
                            <i data-lucide="trash-2"></i>
                            Remove
                        </button>
                    </div>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Degree</label>
                        <input type="text" class="edu-degree" placeholder="Bachelor of Science">
                    </div>
                    <div class="form-group">
                        <label>Institution</label>
                        <input type="text" class="edu-institution" placeholder="University Name">
                    </div>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Start Date</label>
                        <input type="date" class="edu-start">
                    </div>
                    <div class="form-group">
                        <label>End Date</label>
                        <input type="date" class="edu-end">
                    </div>
                </div>
            </div>
        `;

        document.getElementById('educationList').insertAdjacentHTML('beforeend', html);
        this.initLucideIcons();

        // Bind events for new inputs
        const newItem = document.querySelector(`[data-id="${this.educationCounter}"]`);
        newItem.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => {
                this.updateFromForm();
                this.updateProgress();
                this.updatePreview();
            });
        });
    }

    addSkill() {
        this.skillCounter++;
        const html = `
            <div class="item skill-item" data-id="${this.skillCounter}">
                <div class="item-header">
                    <h5>Skill Category ${this.skillCounter}</h5>
                    <div class="item-actions">
                        <button type="button" class="btn btn-sm btn-danger" onclick="removeSkill(${this.skillCounter})">
                            <i data-lucide="trash-2"></i>
                            Remove
                        </button>
                    </div>
                </div>
                <div class="form-group">
                    <label>Category</label>
                    <input type="text" class="skill-category" placeholder="Programming Languages">
                </div>
                <div class="form-group">
                    <label>Skills (comma-separated)</label>
                    <input type="text" class="skill-list" placeholder="JavaScript, Python, Java">
                </div>
            </div>
        `;

        document.getElementById('skillsList').insertAdjacentHTML('beforeend', html);
        this.initLucideIcons();

        // Bind events for new inputs
        const newItem = document.querySelector(`[data-id="${this.skillCounter}"]`);
        newItem.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => {
                this.updateFromForm();
                this.updateProgress();
                this.updatePreview();
            });
        });
    }

    updatePreview() {
        const preview = document.getElementById('resumePreview');
        const data = this.resumeData;

        if (!data.personalInfo.firstName && !data.personalInfo.lastName) {
            preview.innerHTML = `
                <div class="empty-preview">
                    <p>No Resume to Preview</p>
                    <p>Fill out the form to see your resume preview</p>
                </div>
            `;
            return;
        }

        let html = `
            <div class="resume-header">
                <h1 class="resume-name">${data.personalInfo.firstName} ${data.personalInfo.lastName}</h1>
                <h2 class="resume-title">${data.personalInfo.title}</h2>
                <div class="resume-contact">
                    <span>${data.personalInfo.email}</span>
                    <span>•</span>
                    <span>${data.personalInfo.phone}</span>
                    <span>•</span>
                    <span>${data.personalInfo.location}</span>
                </div>
            </div>
        `;

        // Professional Summary
        if (data.personalInfo.summary) {
            html += `
                <div class="resume-section">
                    <h3 class="resume-section-title">PROFESSIONAL SUMMARY</h3>
                    <p>${data.personalInfo.summary}</p>
                </div>
            `;
        }

        // Work Experience
        if (data.experiences.length > 0) {
            html += `
                <div class="resume-section">
                    <h3 class="resume-section-title">WORK EXPERIENCE</h3>
            `;

            data.experiences.forEach(exp => {
                const startDate = exp.startDate ? this.formatDate(exp.startDate) : '';
                const endDate = exp.endDate ? this.formatDate(exp.endDate) : 'Present';

                html += `
                    <div class="resume-item">
                        <div class="resume-item-header">
                            <div>
                                <div class="resume-item-title">${exp.title}</div>
                                <div class="resume-item-subtitle">${exp.company}</div>
                            </div>
                            <div class="resume-item-date">${startDate} - ${endDate}</div>
                        </div>
                        <div class="resume-item-description">${exp.description}</div>
                    </div>
                `;
            });

            html += `</div>`;
        }

        // Education
        if (data.education.length > 0) {
            html += `
                <div class="resume-section">
                    <h3 class="resume-section-title">EDUCATION</h3>
            `;

            data.education.forEach(edu => {
                const startDate = edu.startDate ? this.formatDate(edu.startDate) : '';
                const endDate = edu.endDate ? this.formatDate(edu.endDate) : 'Present';

                html += `
                    <div class="resume-item">
                        <div class="resume-item-header">
                            <div>
                                <div class="resume-item-title">${edu.degree}</div>
                                <div class="resume-item-subtitle">${edu.institution}</div>
                            </div>
                            <div class="resume-item-date">${startDate} - ${endDate}</div>
                        </div>
                    </div>
                `;
            });

            html += `</div>`;
        }

        // Skills
        if (data.skills.length > 0) {
            html += `
                <div class="resume-section">
                    <h3 class="resume-section-title">TECHNICAL SKILLS</h3>
                    <div class="resume-skills-grid">
            `;

            data.skills.forEach(skill => {
                html += `
                    <div class="resume-skill-group">
                        <h4>${skill.category}</h4>
                        <p>${skill.skills.join(', ')}</p>
                    </div>
                `;
            });

            html += `</div></div>`;
        }

        preview.innerHTML = html;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    }

    async generateAISuggestions() {
        const generateBtn = document.getElementById('generateAIBtn');
        const contentDiv = document.getElementById('aiSuggestionsContent');

        generateBtn.disabled = true;
        generateBtn.innerHTML = '<i data-lucide="loader-2"></i> Generating...';

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    resumeData: this.resumeData
                })
            });

            const result = await response.json();

            if (result.success) {
                // Parse AI response and display suggestions
                this.displayAISuggestions(result.suggestions);
            } else {
                this.showToast('Error', result.error || 'Failed to generate suggestions', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showToast('Error', 'Failed to generate AI suggestions. Please try again.', 'error');
        } finally {
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<i data-lucide="sparkles"></i> Get AI Suggestions';
            this.initLucideIcons();
        }
    }

    displayAISuggestions(suggestions) {
        const contentDiv = document.getElementById('aiSuggestionsContent');

        // For now, display the raw suggestions. You can parse and format this better
        contentDiv.innerHTML = `
            <div class="ai-section">
                <div class="ai-section-title">
                    <i data-lucide="lightbulb"></i>
                    AI Recommendations
                </div>
                <div style="white-space: pre-wrap; font-size: 0.875rem; line-height: 1.5;">
                    ${suggestions}
                </div>
            </div>
        `;

        this.initLucideIcons();
    }

    saveResume() {
        this.updateFromForm();

        const resumeJson = JSON.stringify(this.resumeData, null, 2);
        const blob = new Blob([resumeJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.resumeData.personalInfo.firstName || 'resume'}_data.json`;
        a.click();

        URL.revokeObjectURL(url);
        this.showToast('Success', 'Resume data saved successfully!', 'success');
    }

    downloadPDF() {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();

        const data = this.resumeData;
        let y = 20;
        const leftMargin = 20;
        const pageWidth = pdf.internal.pageSize.width;

        // Header
        pdf.setFontSize(20);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${data.personalInfo.firstName} ${data.personalInfo.lastName}`, leftMargin, y);
        y += 10;

        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'normal');
        pdf.text(data.personalInfo.title, leftMargin, y);
        y += 8;

        pdf.setFontSize(10);
        const contact = `${data.personalInfo.email} • ${data.personalInfo.phone} • ${data.personalInfo.location}`;
        pdf.text(contact, leftMargin, y);
        y += 15;

        // Professional Summary
        if (data.personalInfo.summary) {
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.text('PROFESSIONAL SUMMARY', leftMargin, y);
            y += 8;

            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            const summaryLines = pdf.splitTextToSize(data.personalInfo.summary, pageWidth - 40);
            pdf.text(summaryLines, leftMargin, y);
            y += summaryLines.length * 4 + 10;
        }

        // Work Experience
        if (data.experiences.length > 0) {
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.text('WORK EXPERIENCE', leftMargin, y);
            y += 8;

            data.experiences.forEach(exp => {
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(11);
                pdf.text(exp.title, leftMargin, y);

                const startDate = exp.startDate ? this.formatDate(exp.startDate) : '';
                const endDate = exp.endDate ? this.formatDate(exp.endDate) : 'Present';
                const dateRange = `${startDate} - ${endDate}`;

                pdf.setFont('helvetica', 'normal');
                pdf.text(dateRange, pageWidth - pdf.getTextWidth(dateRange) - 20, y);
                y += 6;

                pdf.text(exp.company, leftMargin, y);
                y += 6;

                if (exp.description) {
                    const descLines = pdf.splitTextToSize(exp.description, pageWidth - 40);
                    pdf.text(descLines, leftMargin, y);
                    y += descLines.length * 4;
                }
                y += 8;
            });
        }

        // Education
        if (data.education.length > 0) {
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.text('EDUCATION', leftMargin, y);
            y += 8;

            data.education.forEach(edu => {
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(11);
                pdf.text(edu.degree, leftMargin, y);

                const startDate = edu.startDate ? this.formatDate(edu.startDate) : '';
                const endDate = edu.endDate ? this.formatDate(edu.endDate) : 'Present';
                const dateRange = `${startDate} - ${endDate}`;

                pdf.setFont('helvetica', 'normal');
                pdf.text(dateRange, pageWidth - pdf.getTextWidth(dateRange) - 20, y);
                y += 6;

                pdf.text(edu.institution, leftMargin, y);
                y += 10;
            });
        }

        // Skills
        if (data.skills.length > 0) {
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.text('TECHNICAL SKILLS', leftMargin, y);
            y += 8;

            data.skills.forEach(skill => {
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(10);
                pdf.text(`${skill.category}:`, leftMargin, y);

                pdf.setFont('helvetica', 'normal');
                pdf.text(skill.skills.join(', '), leftMargin + pdf.getTextWidth(`${skill.category}: `), y);
                y += 6;
            });
        }

        pdf.save(`${data.personalInfo.firstName || 'resume'}.pdf`);
        this.showToast('Success', 'Resume PDF downloaded successfully!', 'success');
    }

    scrollToAI() {
        document.querySelector('.ai-card').scrollIntoView({ behavior: 'smooth' });
    }

    showToast(title, message, type = 'success') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        toast.innerHTML = `
            <div class="toast-title">${title}</div>
            <div class="toast-description">${message}</div>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 5000);
    }
}

// Global functions for remove buttons
function removeExperience(id) {
    document.querySelector(`.experience-item[data-id="${id}"]`).remove();
    resumeBuilder.updateFromForm();
    resumeBuilder.updateProgress();
    resumeBuilder.updatePreview();
}

function removeEducation(id) {
    document.querySelector(`.education-item[data-id="${id}"]`).remove();
    resumeBuilder.updateFromForm();
    resumeBuilder.updateProgress();
    resumeBuilder.updatePreview();
}

function removeSkill(id) {
    document.querySelector(`.skill-item[data-id="${id}"]`).remove();
    resumeBuilder.updateFromForm();
    resumeBuilder.updateProgress();
    resumeBuilder.updatePreview();
}

// Navigation functions
function nextSection(section) {
    resumeBuilder.nextSection(section);
}

function previousSection(section) {
    resumeBuilder.previousSection(section);
}

function addExperience() {
    resumeBuilder.addExperience();
}

function addEducation() {
    resumeBuilder.addEducation();
}

function addSkill() {
    resumeBuilder.addSkill();
}

function saveResume() {
    resumeBuilder.saveResume();
}

function downloadPDF() {
    resumeBuilder.downloadPDF();
}

function scrollToAI() {
    resumeBuilder.scrollToAI();
}

// Initialize the application
let resumeBuilder;
document.addEventListener('DOMContentLoaded', () => {
    resumeBuilder = new ResumeBuilder();
});