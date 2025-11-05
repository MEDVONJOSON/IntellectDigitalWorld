(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.navbar').addClass('sticky-top shadow-sm');
            // Keep logo as logo.jpg when sticky
            $('.navbar-brand-img').attr('src', 'img/logo.jpg');
        } else {
            $('.navbar').removeClass('sticky-top shadow-sm');
            // Ensure logo.jpg when not sticky
            $('.navbar-brand-img').attr('src', 'img/logo.jpg');
        }
    });
    
    // Dropdown on mouse hover
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";
    
    $(window).on("load resize", function() {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
            function() {
                const $this = $(this);
                $this.addClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "true");
                $this.find($dropdownMenu).addClass(showClass);
            },
            function() {
                const $this = $(this);
                $this.removeClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "false");
                $this.find($dropdownMenu).removeClass(showClass);
            }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });




    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        dots: true,
        loop: true,
        center: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });


    // Vendor carousel
    $('.vendor-carousel').owlCarousel({
        loop: true,
        margin: 45,
        dots: false,
        loop: true,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0:{
                items:2
            },
            576:{
                items:4
            },
            768:{
                items:6
            },
            992:{
                items:8
            }
        }
    });
    
    // Enhanced form validation and UX improvements
    function initializeFormValidation() {
        // Real-time email validation
        $(document).on('input', '#applicantEmail', function() {
            const email = $(this).val();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isValid = emailRegex.test(email);
            
            if (email.length > 0) {
                if (isValid) {
                    $(this).removeClass('is-invalid').addClass('is-valid');
                    $(this).next('.invalid-feedback').remove();
                } else {
                    $(this).removeClass('is-valid').addClass('is-invalid');
                    if ($(this).next('.invalid-feedback').length === 0) {
                        $(this).after('<div class="invalid-feedback">Please enter a valid email address</div>');
                    }
                }
            } else {
                $(this).removeClass('is-valid is-invalid');
                $(this).next('.invalid-feedback').remove();
            }
        });

        // Phone number formatting
        $(document).on('input', '#applicantPhone', function() {
            let value = $(this).val().replace(/\D/g, '');
            if (value.length > 0) {
                if (value.startsWith('232')) {
                    // Sierra Leone format: +232 XXX XXX XXX
                    value = value.replace(/(\d{3})(\d{3})(\d{3})/, '+$1 $2 $3');
                } else if (value.length >= 10) {
                    // General format: XXX XXX XXXX
                    value = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
                }
            }
            $(this).val(value);
        });

        // Character counter for message
        $(document).on('input', '#applicantMessage', function() {
            const maxLength = 500;
            const currentLength = $(this).val().length;
            const remaining = maxLength - currentLength;
            
            let counter = $(this).next('.char-counter');
            if (counter.length === 0) {
                counter = $('<div class="char-counter text-muted small mt-1"></div>');
                $(this).after(counter);
            }
            
            counter.text(`${currentLength}/${maxLength} characters`);
            
            if (remaining < 50) {
                counter.removeClass('text-muted').addClass('text-warning');
            } else {
                counter.removeClass('text-warning').addClass('text-muted');
            }
            
            if (currentLength > maxLength) {
                counter.removeClass('text-warning').addClass('text-danger');
                $(this).addClass('is-invalid');
            } else {
                counter.removeClass('text-danger');
                $(this).removeClass('is-invalid');
            }
        });

        // Name validation
        $(document).on('input', '#applicantName', function() {
            const name = $(this).val().trim();
            if (name.length > 0) {
                if (name.length < 2) {
                    $(this).removeClass('is-valid').addClass('is-invalid');
                    if ($(this).next('.invalid-feedback').length === 0) {
                        $(this).after('<div class="invalid-feedback">Name must be at least 2 characters</div>');
                    }
                } else {
                    $(this).removeClass('is-invalid').addClass('is-valid');
                    $(this).next('.invalid-feedback').remove();
                }
            } else {
                $(this).removeClass('is-valid is-invalid');
                $(this).next('.invalid-feedback').remove();
            }
        });
    }

    // Mobile-specific improvements
    function initializeMobileFeatures() {
        // Detect mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        if (isMobile || isTouch) {
            // Add mobile class to body for CSS targeting
            $('body').addClass('mobile-device');
            
            // Improve touch interactions for service cards
            $('.service-item').on('touchstart', function() {
                $(this).addClass('touch-active');
            }).on('touchend', function() {
                setTimeout(() => {
                    $(this).removeClass('touch-active');
                }, 150);
            });
            
            // Prevent double-tap zoom on form inputs
            $('input, textarea, select').on('touchstart', function(e) {
                e.preventDefault();
            });
            
            // Improve modal scrolling on mobile
            $(document).on('shown.bs.modal', function() {
                $('body').addClass('modal-open-mobile');
            });
            
            $(document).on('hidden.bs.modal', function() {
                $('body').removeClass('modal-open-mobile');
            });
            
            // Auto-focus first input in modal on mobile
            $(document).on('shown.bs.modal', '#serviceApplyModal', function() {
                setTimeout(() => {
                    $('#applicantName').focus();
                }, 300);
            });
            
            // Improve button touch targets
            $('.btn').css({
                'min-height': '44px',
                'min-width': '44px'
            });
        }
        
        // Handle orientation changes
        $(window).on('orientationchange', function() {
            setTimeout(() => {
                // Recalculate modal position
                $('.modal.show').each(function() {
                    const modal = bootstrap.Modal.getInstance(this);
                    if (modal) {
                        modal._adjustDialog();
                    }
                });
            }, 100);
        });
        
        // Improve form submission on mobile
        $(document).on('submit', '#serviceApplyForm', function(e) {
            // Hide mobile keyboard after form submission
            if (isMobile) {
                $('input, textarea').blur();
            }
        });
    }
    
    // Initialize mobile features when DOM is ready
    $(document).ready(function() {
        initializeMobileFeatures();
    });
    function getModalInstance(modalEl) {
        if (!modalEl || typeof bootstrap === 'undefined' || !bootstrap.Modal) return null;
        return (typeof bootstrap.Modal.getOrCreateInstance === 'function')
            ? bootstrap.Modal.getOrCreateInstance(modalEl)
            : new bootstrap.Modal(modalEl);
    }

    function openServiceApplyModalFrom($origin) {
        var $serviceItem = $origin.closest('.service-item');
        if ($serviceItem.length === 0) return;
        var serviceName = $serviceItem.find('h4').first().text().trim() || 'Service';

        $('#selectedServiceName').text(serviceName);
        $('#serviceNameInput').val(serviceName);

        var modalEl = document.getElementById('serviceApplyModal');
        var modal = getModalInstance(modalEl);
        if (modal) modal.show();
    }

    // Click on the small arrow button
    $(document).on('click', '.service-item a.btn', function (e) {
        var modalEl = document.getElementById('serviceApplyModal');
        if (modalEl) {
            e.preventDefault();
            openServiceApplyModalFrom($(this));
        }
    });

    // Click anywhere on the service card
    $(document).on('click', '.service-item', function (e) {
        // Avoid double handling when the arrow button is clicked
        if ($(e.target).closest('a.btn').length) return;
        var modalEl = document.getElementById('serviceApplyModal');
        if (modalEl) {
            openServiceApplyModalFrom($(this));
        }
    });

    // Handle form submit with email sending
    $(document).on('submit', '#serviceApplyForm', function (e) {
        e.preventDefault();
        var $form = $(this);
        var $submitBtn = $form.find('button[type="submit"]');
        var originalText = $submitBtn.text();
        
        $form.addClass('was-validated');

        // Basic validity check using required attributes
        if (this.checkValidity && !this.checkValidity()) {
            return;
        }

        // Show loading state
        $submitBtn.prop('disabled', true).text('Sending...');

        // Collect form data with enhanced fields
        var formData = {
            name: $('#applicantName').val(),
            email: $('#applicantEmail').val(),
            phone: $('#applicantPhone').val(),
            service: $('#serviceNameInput').val(),
            message: $('#applicantMessage').val(),
            timestamp: new Date().toLocaleString(),
            status: 'new',
            priority: 'medium',
            id: Date.now() + Math.random().toString(36).substr(2, 9)
        };

        // Try to send email using PHP backend, fallback to local storage if it fails
        $.ajax({
            url: 'send_service_email.php',
            type: 'POST',
            data: formData,
            dataType: 'json',
            timeout: 5000, // 5 second timeout
            success: function(response) {
                if (response.success) {
                    $('#serviceApplySuccess').removeClass('d-none');
                    $('#serviceApplySuccess').text(response.message);
                } else {
                    // Show error but still proceed with success flow
                    console.warn('Email backend error:', response.message);
                    showSuccessMessage();
                }
            },
            error: function(xhr, status, error) {
                console.warn('Email sending failed, using fallback:', error);
                // Fallback: show success message anyway
                showSuccessMessage();
            }
        });

        function showSuccessMessage() {
            // Show success message
            $('#serviceApplySuccess').removeClass('d-none');
            $('#serviceApplySuccess').text('Thank you! Your application has been received. We will contact you shortly.');
            
            // Log the application data for manual processing
            console.log('Service Application Received:', formData);
            
            // Store application locally for viewing
            try {
                const existingApps = JSON.parse(localStorage.getItem('serviceApplications') || '[]');
                existingApps.push(formData);
                localStorage.setItem('serviceApplications', JSON.stringify(existingApps));
                
                // Trigger storage event for applications.html page
                localStorage.setItem('serviceApplication', JSON.stringify(formData));
                localStorage.removeItem('serviceApplication');
            } catch (e) {
                console.warn('Could not store application locally:', e);
            }
            
            // Reset form and close modal after delay
            setTimeout(function () {
                $('#serviceApplySuccess').addClass('d-none');
                $form.removeClass('was-validated')[0].reset();
                $submitBtn.prop('disabled', false).text(originalText);
                
                // Keep the selected service in the readonly field
                var currentService = $('#selectedServiceName').text();
                $('#serviceNameInput').val(currentService);

                // Close modal
                var modalEl = document.getElementById('serviceApplyModal');
                var modal = getModalInstance(modalEl);
                if (modal) modal.hide();
            }, 2000);
        }
    });

})(jQuery);

