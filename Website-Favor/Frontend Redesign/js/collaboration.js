document.addEventListener('DOMContentLoaded', () => {
    initializeAccordion();
    initializeBrandItems();
    initializeDropdowns();
    initializeForm();
});

function initializeAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true'; // ← PERBAIKI INI

            accordionHeaders.forEach(h => {
                h.setAttribute('aria-expanded', 'false');
            });

            if (!isExpanded) {
                header.setAttribute('aria-expanded', 'true');
            }
        });

        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
            }
        });
    });
}

function initializeBrandItems() {
    const brandItems = document.querySelectorAll('.brand-item');

    brandItems.forEach(item => {
        const header = item.querySelector('.brand-header');

        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            brandItems.forEach(i => i.classList.remove('active'));
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

function initializeDropdowns() {
    const benefitsToggle = document.getElementById('benefitsToggle');
    const moreBenefits = document.getElementById('moreBenefits');

    if (benefitsToggle && moreBenefits) {
        benefitsToggle.addEventListener('click', () => {
            const isHidden = moreBenefits.classList.contains('hidden');

            if (isHidden) {
                moreBenefits.classList.remove('hidden');
                moreBenefits.classList.add('visible');
                benefitsToggle.classList.add('active');
                benefitsToggle.querySelector('span').textContent = 'View Less';
            } else {
                moreBenefits.classList.remove('visible');
                moreBenefits.classList.add('hidden');
                benefitsToggle.classList.remove('active');
                benefitsToggle.querySelector('span').textContent = 'View More Reasons';
            }
        });
    }

    const processToggle = document.getElementById('processToggle');
    const moreSteps = document.querySelectorAll('#moreSteps, #moreSteps + .step');

    if (processToggle && moreSteps.length > 0) {
        processToggle.addEventListener('click', () => {
            const isHidden = moreSteps[0].classList.contains('hidden');

            if (isHidden) {
                moreSteps.forEach(step => {
                    step.classList.remove('hidden');
                    step.classList.add('visible');
                });
                processToggle.classList.add('active');
                processToggle.querySelector('span').textContent = 'View Less';
            } else {
                moreSteps.forEach(step => {
                    step.classList.remove('visible');
                    step.classList.add('hidden');
                });
                processToggle.classList.remove('active');
                processToggle.querySelector('span').textContent = 'View Full Process';
            }
        });
    }

    const proofToggle = document.getElementById('proofToggle');
    const proofDetail = document.getElementById('proofDetail');
    if (proofToggle && proofDetail) {
        proofToggle.addEventListener('click', () => {
            const isHidden = proofDetail.classList.contains('hidden');

            if (isHidden) {
                proofDetail.classList.remove('hidden');
                proofDetail.classList.add('visible');
                proofToggle.classList.add('active');
                proofToggle.querySelector('span').textContent = 'Read Less';
            } else {
                proofDetail.classList.remove('visible');
                proofDetail.classList.add('hidden');
                proofToggle.classList.remove('active');
                proofToggle.querySelector('span').textContent = 'Read More';
            }
        });
    }
}

function initializeForm() {
    const form = document.getElementById('partnershipForm');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            console.log('Partnership inquiry submitted:', data);
            alert('Thank you for your partnership inquiry! Our business development team will contact you within 2-3 business days.');
            form.reset();
        });
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const accordionHeaders = document.querySelectorAll('.accordion-header[aria-expanded="true"]');
        accordionHeaders.forEach(header => {
            header.setAttribute('aria-expanded', 'false');
        });

        const brandItems = document.querySelectorAll('.brand-item.active');
        brandItems.forEach(item => {
            item.classList.remove('active');
        });
    }
});
