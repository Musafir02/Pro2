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
        lucide.createIcons();

        // Bind event listeners
        this.bindEvents();

        // Update progress on load
        this.updateProgress();

        // Update preview
        this.updatePreview();
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
        lucide.createIcons();
    }

    markSectionIncomplete(section) {
        const progressSection = document.querySelector(`[data-section="${section}"]`);
        progressSection.classList.remove('completed');
        const icon = progressSection.querySelector('.progress-icon');
        icon.setAttribute('data-lucide', 'circle');
        lucide.createIcons();
    }

    addExperience() {
        this.experienceCounter++;
        const html = `
            <div class="item experience-item" data-id="${this.experienceCounter}">
                <div class="form-group">
                    <label>Job Title</label>
                    <input type="text" class="exp-title" placeholder="Senior Software Engineer">
                </div>
                <div class="form-group">
                    <label>Company</label>
                    <input type="text" class="exp-company" placeholder="Tech Corp Inc.">
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Start Date</label>
                        <input type="month" class="exp-start">
                    </div>
                    <div class="form-group">
                        <label>End Date</label>
                        <input type="month" class="exp-end" placeholder="Leave empty if current">
                    </div>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea class="exp-description" rows="3" placeholder="Describe your key responsibilities and achievements..."></textarea>
                </div>
                <div class="item-actions">
                    <button type="button" class="btn btn-danger btn-sm" onclick="removeExperience(${this.experienceCounter})">
                        <i data-lucide="trash-2"></i>
                        Remove
                    </button>
                </div>
            </div>
        `;

        document.getElementById('experienceList').insertAdjacentHTML('beforeend', html);
        lucide.createIcons();

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
                <div class="form-group">
                    <label>Degree</label>
                    <input type="text" class="edu-degree" placeholder="Bachelor of Science in Computer Science">
                </div>
                <div class="form-group">
                    <label>Institution</label>
                    <input type="text" class="edu-institution" placeholder="University of California, Berkeley">
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Start Date</label>
                        <input type="month" class="edu-start">
                    </div>
                    <div class="form-group">
                        <label>End Date</label>
                        <input type="month" class="edu-end" placeholder="Leave empty if current">
                    </div>
                </div>
                <div class="item-actions">
                    <button type="button" class="btn btn-danger btn-sm" onclick="removeEducation(${this.educationCounter})">
                        <i data-lucide="trash-2"></i>
                        Remove
                    </button>
                </div>
            </div>
        `;

        document.getElementById('educationList').insertAdjacentHTML('beforeend', html);
        lucide.createIcons();

        // Bind events for new inputs
        const newItem = document.querySelector(`[data-id="${this.educationCounter}"]`);
        newItem.querySelectorAll('input').forEach(input => {
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
                <div class="form-group">
                    <label>Category</label>
                    <input type="text" class="skill-category" placeholder="Programming Languages">
                </div>
                <div class="form-group">
                    <label>Skills (comma separated)</label>
                    <input type="text" class="skill-list" placeholder="JavaScript, Python, Java, React">
                </div>
                <div class="item-actions">
                    <button type="button" class="btn btn-danger btn-sm" onclick="removeSkill(${this.skillCounter})">
                        <i data-lucide="trash-2"></i>
                        Remove
                    </button>
                </div>
            </div>
        `;

        document.getElementById('skillsList').insertAdjacentHTML('beforeend', html);
        lucide.createIcons();

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

        if (data.personalInfo.summary) {
            html += `
                <div class="resume-section">
                    <h3 class="resume-section-title">PROFESSIONAL SUMMARY</h3>
                    <p>${data.personalInfo.summary}</p>
                </div>
            `;
        }

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
                        ${exp.description ? `<div class="resume-item-description">${this.formatDescription(exp.description)}</div>` : ''}
                    </div>
                `;
            });

            html += `</div>`;
        }

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

        if (data.skills.length > 0) {
            html += `
                <div class="resume-section">
                    <h3 class="resume-section-title">TECHNICAL SKILLS</h3>
                    <div class="resume-skills-grid">
            `;

            data.skills.forEach(skillGroup => {
                html += `
                    <div class="resume-skill-group">
                        <h4>${skillGroup.category}</h4>
                        <p>${skillGroup.skills.join(', ')}</p>
                    </div>
                `;
            });

            html += `</div></div>`;
        }

        preview.innerHTML = html;
    }

    formatDate(dateString) {
        if (!dateString) return 'Present';
        const date = new Date(dateString + '-01');
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }

    formatDescription(description) {
        return description.split('\n').map(line => {
            line = line.trim();
            if (line.startsWith('•') || line.startsWith('-')) {
                return `<p>• ${line.replace(/^[•-]\s*/, '')}</p>`;
            }
            return `<p>${line}</p>`;
        }).join('');
    }

    async saveResume() {
        this.showLoading('Saving resume...');

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Save to localStorage for demo
            localStorage.setItem('resumeData', JSON.stringify(this.resumeData));

            this.showToast('Resume Saved', 'Your resume has been saved successfully.', 'success');
        } catch (error) {
            this.showToast('Error', 'Failed to save resume. Please try again.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async downloadPDF() {
        if (!this.resumeData.personalInfo.firstName) {
            this.showToast('No Resume', 'Please create a resume first.', 'error');
            return;
        }

        this.showLoading('Generating PDF...');

        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();

            const data = this.resumeData;
            let y = 20;
            const leftMargin = 20;
            const pageWidth = pdf.internal.pageSize.getWidth();

            // Header
            pdf.setFontSize(24);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`${data.personalInfo.firstName} ${data.personalInfo.lastName}`, leftMargin, y);
            y += 10;

            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'normal');
            pdf.text(data.personalInfo.title, leftMargin, y);
            y += 8;

            pdf.setFontSize(10);
            const contactInfo = `${data.personalInfo.email} • ${data.personalInfo.phone} • ${data.personalInfo.location}`;
            pdf.text(contactInfo, leftMargin, y);
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

                data.skills.forEach(skillGroup => {
                    pdf.setFont('helvetica', 'bold');
                    pdf.setFontSize(10);
                    pdf.text(`${skillGroup.category}:`, leftMargin, y);

                    pdf.setFont('helvetica', 'normal');
                    const skillsText = skillGroup.skills.join(', ');
                    const skillsLines = pdf.splitTextToSize(skillsText, pageWidth - 80);
                    pdf.text(skillsLines, leftMargin + 60, y);
                    y += skillsLines.length * 4 + 6;
                });
            }

            const filename = `${data.personalInfo.firstName}_${data.personalInfo.lastName}_Resume.pdf`.replace(/\s+/g, '_');
            pdf.save(filename);

            this.showToast('PDF Downloaded', 'Your resume has been downloaded as PDF.', 'success');
        } catch (error) {
            this.showToast('Error', 'Failed to generate PDF. Please try again.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async generateAISuggestions() {
        this.showLoading('Generating AI suggestions...');

        try {
            // Check if OpenAI API key is available
            const apiKey = prompt('Please enter your OpenAI API key to generate suggestions:');
            if (!apiKey) {
                this.showToast('API Key Required', 'OpenAI API key is required for AI suggestions.', 'error');
                return;
            }

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a professional career coach and resume expert. Provide specific, actionable advice for resume improvement and career development.'
                        },
                        {
                            role: 'user',
                            content: `Analyze the following resume data and provide actionable suggestions for improvement and learning recommendations.

Resume Data:
${JSON.stringify(this.resumeData, null, 2)}

Please provide:
1. Resume improvement suggestions (focus on content, formatting, missing elements, quantifiable achievements)
2. Learning recommendations based on the person's field and experience level

Respond with JSON in this exact format:
{
  "improvements": [
    {
      "type": "improvement",
      "category": "content|formatting|skills|experience",
      "suggestion": "specific actionable suggestion",
      "priority": "high|medium|low"
    }
  ],
  "learning": [
    {
      "type": "learning",
      "category": "skill|certification|course|technology",
      "suggestion": "specific learning recommendation",
      "reason": "why this would be beneficial"
    }
  ]
}`
                        }
                    ],
                    response_format: { type: 'json_object' },
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate suggestions');
            }

            const result = await response.json();
            const suggestions = JSON.parse(result.choices[0].message.content);

            this.displayAISuggestions(suggestions);
            this.showToast('AI Suggestions Generated', 'New suggestions have been generated for your resume.', 'success');
        } catch (error) {
            console.error('Error generating AI suggestions:', error);
            this.showToast('Error', 'Failed to generate AI suggestions. Please check your API key and try again.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    displayAISuggestions(suggestions) {
        const container = document.getElementById('aiSuggestionsContent');
        let html = '<div class="ai-suggestions">';

        if (suggestions.improvements && suggestions.improvements.length > 0) {
            html += `
                <div class="ai-section">
                    <h4 class="ai-section-title">
                        <i data-lucide="lightbulb" style="color: #f59e0b;"></i>
                        Resume Improvements
                    </h4>
            `;

            suggestions.improvements.forEach(suggestion => {
                html += `
                    <div class="ai-suggestion">
                        <div class="ai-dot improvement"></div>
                        <div class="ai-suggestion-content">
                            <p class="ai-suggestion-text">${suggestion.suggestion}</p>
                            <span class="ai-badge">${suggestion.category}</span>
                        </div>
                    </div>
                `;
            });

            html += '</div>';
        }

        if (suggestions.learning && suggestions.learning.length > 0) {
            html += `
                <div class="ai-section">
                    <h4 class="ai-section-title">
                        <i data-lucide="graduation-cap" style="color: #3b82f6;"></i>
                        Learning Suggestions
                    </h4>
            `;

            suggestions.learning.forEach(suggestion => {
                html += `
                    <div class="ai-suggestion">
                        <div class="ai-dot learning"></div>
                        <div class="ai-suggestion-content">
                            <p class="ai-suggestion-text">${suggestion.suggestion}</p>
                            <span class="ai-badge">${suggestion.category}</span>
                        </div>
                    </div>
                `;
            });

            html += '</div>';
        }

        html += '</div>';
        container.innerHTML = html;
        lucide.createIcons();
    }

    showLoading(text = 'Loading...') {
        document.getElementById('loadingText').textContent = text;
        document.getElementById('loadingOverlay').classList.add('active');
    }

    hideLoading() {
        document.getElementById('loadingOverlay').classList.remove('active');
    }

    showToast(title, description, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-title">${title}</div>
            <div class="toast-description">${description}</div>
        `;

        document.getElementById('toastContainer').appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    scrollToAI() {
        document.querySelector('.ai-card').scrollIntoView({ behavior: 'smooth' });
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