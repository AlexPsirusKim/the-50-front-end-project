/**
 * 로그인 페이지 JavaScript
 * 폼 검증, 비밀번호 표시/숨김, 로그인 처리 등의 기능 제공
 */

// DOM 요소 선택
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const rememberCheckbox = document.getElementById('remember');

// ========================
// 이벤트 리스너
// ========================

/**
 * 폼 제출 이벤트
 */
loginForm.addEventListener('submit', handleLogin);

/**
 * 비밀번호 표시/숨김 토글
 */
togglePasswordBtn.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // 아이콘 변경
    const eyeIcon = togglePasswordBtn.querySelector('.eye-icon');
    eyeIcon.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
});

/**
 * 입력 필드 실시간 검증
 */
emailInput.addEventListener('blur', validateEmail);
passwordInput.addEventListener('blur', validatePassword);

// ========================
// 검증 함수
// ========================

/**
 * 이메일 검증
 */
function validateEmail() {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        emailError.textContent = '이메일을 입력해주세요.';
        return false;
    }
    
    if (!emailRegex.test(email)) {
        emailError.textContent = '올바른 이메일 형식이 아닙니다.';
        return false;
    }
    
    emailError.textContent = '';
    return true;
}

/**
 * 비밀번호 검증
 */
function validatePassword() {
    const password = passwordInput.value;
    
    if (!password) {
        passwordError.textContent = '비밀번호를 입력해주세요.';
        return false;
    }
    
    if (password.length < 6) {
        passwordError.textContent = '비밀번호는 최소 6자 이상이어야 합니다.';
        return false;
    }
    
    passwordError.textContent = '';
    return true;
}

/**
 * 모든 필드 검증
 */
function validateForm() {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    
    return isEmailValid && isPasswordValid;
}

// ========================
// 로그인 처리
// ========================

/**
 * 로그인 처리
 */
async function handleLogin(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const loginBtn = loginForm.querySelector('.btn-login');
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const remember = rememberCheckbox.checked;
    
    // 로딩 상태로 변경
    loginBtn.disabled = true;
    loginBtn.classList.add('loading');
    loginBtn.textContent = '로그인 중...';
    
    try {
        // 실제 API 호출 (데모용으로 2초 지연)
        const response = await simulateLogin(email, password);
        
        if (response.success) {
            // 로그인 상태 저장
            if (remember) {
                localStorage.setItem('userEmail', email);
            } else {
                sessionStorage.setItem('userEmail', email);
            }
            
            // 성공 메시지 표시
            showSuccessMessage('로그인 성공! 리다이렉트 중...');
            
            // 2초 후 리다이렉트
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            showErrorMessage(response.message);
        }
    } catch (error) {
        showErrorMessage('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
        console.error('Login error:', error);
    } finally {
        // 버튼 상태 복원
        loginBtn.disabled = false;
        loginBtn.classList.remove('loading');
        loginBtn.textContent = '로그인';
    }
}

/**
 * 로그인 시뮬레이션 (실제로는 API 호출)
 */
function simulateLogin(email, password) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // 데모 계정
            if (email === 'user@example.com' && password === 'password123') {
                resolve({
                    success: true,
                    message: '로그인 성공!'
                });
            } else {
                resolve({
                    success: false,
                    message: '이메일 또는 비밀번호가 일치하지 않습니다.'
                });
            }
        }, 2000);
    });
}

// ========================
// 메시지 표시
// ========================

/**
 * 성공 메시지 표시
 */
function showSuccessMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'success-message';
    alertDiv.textContent = message;
    
    loginForm.parentElement.insertBefore(alertDiv, loginForm);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

/**
 * 에러 메시지 표시
 */
function showErrorMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'error-alert';
    alertDiv.textContent = message;
    
    loginForm.parentElement.insertBefore(alertDiv, loginForm);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// ========================
// 초기화
// ========================

/**
 * 페이지 로드 시 저장된 이메일 복원
 */
window.addEventListener('DOMContentLoaded', () => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberCheckbox.checked = true;
    }
});

// ========================
// 추가 기능 (선택 사항)
// ========================

/**
 * 소셜 로그인 버튼 처리
 */
const socialButtons = document.querySelectorAll('.btn-social');
socialButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const provider = button.classList.contains('btn-google') ? 'Google' : 'Facebook';
        console.log(`${provider} 로그인 처리`);
        // 실제 소셜 로그인 구현 필요
    });
});

/**
 * 비밀번호 재설정 링크
 */
const forgotPasswordLink = document.querySelector('.link-forgot-password');
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('비밀번호 재설정 페이지로 이동');
        // 비밀번호 재설정 페이지로 이동
    });
}

/**
 * 회원가입 링크
 */
const signupLink = document.querySelector('.link-signup');
if (signupLink) {
    signupLink.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('회원가입 페이지로 이동');
        // 회원가입 페이지로 이동
    });
}
