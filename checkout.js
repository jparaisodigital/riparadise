// ======================
// ORDER SUMMARY
// ======================
function renderCheckoutSummary() {
    const itemsEl = document.getElementById('co-items');
    const subtotalEl = document.getElementById('co-subtotal');
    const shippingEl = document.getElementById('co-shipping');
    const totalEl = document.getElementById('co-total');
    if (!itemsEl) return;
    
    const cart = getCart();
    
    if (!cart.length) {
        itemsEl.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
    } else {
        itemsEl.innerHTML = cart.map(item => `
        <div class="co-item">
          <div class="co-item-img">
            <img src="${item.image}" alt="${item.name}" />
            <span class="co-item-qty">${item.qty}</span>
          </div>
          <div class="co-item-info">
            <div class="co-item-name">${item.name}</div>
            <div class="co-item-meta">Size: ${item.size}</div>
          </div>
          <div class="co-item-price">${formatPrice(item.price * item.qty)}</div>
        </div>
      `).join('');
        }
        
        const subtotal = cartTotal();
        const isCod = selectedPayment === 'cod';
        const region = isCod ? '' : getSelectedRegion();
        const shippingFee = isCod ? 0 : getShippingFee(region);
        
        if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
        if (shippingEl) {
            if (isCod) {
                shippingEl.textContent = 'Arranged via Messenger';
            } else {
                shippingEl.textContent = region ? formatPrice(shippingFee) : 'Select region';
            }
        }
        if (totalEl) totalEl.textContent = formatPrice(subtotal + shippingFee);
    }
    
    function getSelectedRegion() {
        const el = document.getElementById('co-region');
        return el ? el.value : '';
    }
    
    function getShippingFee(region) {
        if (!CONFIG.shipping) return 0;
        if (region === 'luzon') return CONFIG.shipping.luzon;
        if (region === 'visayas_mindanao') return CONFIG.shipping.visayasMindanao;
        return 0;
    }
    
    function updateDeliveryUIForPayment(paymentId) {
        const regionWrap = document.getElementById('co-region-wrap');
        const regionEl = document.getElementById('co-region');
        const infoWrap = document.getElementById('co-delivery-info');
        
        if (paymentId === 'cod') {
            if (regionWrap) regionWrap.style.display = 'none';
            if (regionEl) regionEl.value = '';
            if (infoWrap) {
                infoWrap.innerHTML = `
            <div class="co-delivery-banner">
              <p class="co-delivery-note">${CONFIG.codDelivery.note}</p>
            </div>
          `;
            }
        } else {
            if (regionWrap) regionWrap.style.display = '';
            renderDeliveryInfo();
        }
        
        renderCheckoutSummary();
    }
    
    // ======================
    // PAYMENT METHOD ICONS (SVG, config-driven)
    // ======================
    function paymentIconMarkup(p) {
        if (p.iconImage) {
            return `<img src="${p.iconImage}" alt="${p.label} logo" class="co-payment-icon" />`;
        }
        return `<i class="co-payment-icon-fallback ti-cash-fallback"></i>`;
    }
    
    function courierIconMarkup(c) {
        if (c.iconImage) {
            return `<img src="${c.iconImage}" alt="${c.name} logo" class="co-courier-icon" />`;
        }
        return '';
    }
    
    // ======================
    // DELIVERY INFO BANNER 
    // ======================
    function renderDeliveryInfo() {
        const wrap = document.getElementById('co-delivery-info');
        if (!wrap || !CONFIG.deliveryInfo || !CONFIG.deliveryInfo.enabled) return;
        
        const couriers = CONFIG.deliveryInfo.couriers.map(c => `
            <span class="co-courier">
              ${courierIconMarkup(c)}
              <span class="co-courier-name">${c.name}</span>
            </span>
          `).join('');
            
            wrap.innerHTML = `
      <div class="co-delivery-banner">
        <div class="co-courier-list">${couriers}</div>
        <p class="co-delivery-note">${CONFIG.deliveryInfo.note}</p>
      </div>
    `;
        }
        
        // ======================
        // PAYMENT METHODS (GCASH / COD)
        // ======================
        let selectedPayment = null;
        
        function renderPayments() {
            const wrap = document.getElementById('co-payments');
            if (!wrap || !CONFIG.payments) return;
            
            wrap.innerHTML = CONFIG.payments.map((p, i) => `
      <label class="co-payment ${i === 0 ? 'selected' : ''}">
        <input type="radio" name="payment" value="${p.id}" ${i === 0 ? 'checked' : ''} />
        ${paymentIconMarkup(p)}
        <span class="co-payment-label">${p.label}</span>
      </label>
    `).join('');
            
            selectedPayment = CONFIG.payments[0].id;
            updatePaymentInfo();
            updateDeliveryUIForPayment(selectedPayment);
            
            wrap.querySelectorAll('input[name="payment"]').forEach(radio => {
                radio.addEventListener('change', () => {
                    selectedPayment = radio.value;
                    wrap.querySelectorAll('.co-payment').forEach(el => el.classList.remove('selected'));
                    radio.closest('.co-payment').classList.add('selected');
                    updatePaymentInfo();
                    updateDeliveryUIForPayment(selectedPayment);
                });
            });
        }
        
        function updatePaymentInfo() {
            const qrBox = document.getElementById('co-qr-box');
            const qrImage = document.getElementById('co-qr-image');
            const qrNote = document.getElementById('co-qr-note');
            const codNote = document.getElementById('co-cod-note');
            if (!qrBox) return;
            
            const method = CONFIG.payments.find(p => p.id === selectedPayment);
            
            if (method && method.qr) {
                qrBox.hidden = false;
                codNote.hidden = true;
                qrImage.innerHTML = `<img src="${method.qr}" alt="${method.label} QR" />`;
                qrNote.textContent = `Scan the QR and send the exact amount via ${method.label}. Keep your proof of payment.`;
            } else {
                qrBox.hidden = true;
                codNote.hidden = false;
            }
        }
        
        // ======================
        // VALIDATION + PLACE ORDER
        // ======================
        function val(id) {
            return document.getElementById(id).value.trim();
        }
        
        function validateCheckout() {
            const isCod = selectedPayment === 'cod';
            const required = ['co-email', 'co-firstname', 'co-lastname', 'co-address', 'co-phone'];
            if (!isCod) required.push('co-region');
            
            let valid = true;
            
            required.forEach(id => {
                const el = document.getElementById(id);
                if (!el) return;
                let ok = el.value.trim().length > 0;
                if (ok && id === 'co-email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim());
                el.classList.toggle('invalid', !ok);
                if (!ok) valid = false;
            });
            
            // Clear invalid state on region when COD (it's hidden)
            if (isCod) {
                const regionEl = document.getElementById('co-region');
                if (regionEl) regionEl.classList.remove('invalid');
            }
            
            return valid;
        }
        
        function placeOrder() {
            const btn = document.getElementById('co-place-order');
            const cart = getCart();
            
            if (!cart.length) {
                btn.textContent = 'CART IS EMPTY';
                setTimeout(() => (btn.textContent = 'PLACE ORDER'), 1200);
                return;
            }
            if (!validateCheckout()) return;
            
            const isCod = selectedPayment === 'cod';
            const region = isCod ? '' : getSelectedRegion();
            const shippingFee = isCod ? 0 : getShippingFee(region);
            const subtotal = cartTotal();
            
            const order = {
                number: 'RIP-' + Date.now().toString().slice(-6),
                date: new Date().toISOString(),
                payment: selectedPayment,
                customer: {
                    email: val('co-email'),
                    firstName: val('co-firstname'),
                    lastName: val('co-lastname'),
                    address: val('co-address'),
                    region: region,
                    phone: val('co-phone'),
                    postal: val('co-postal')
                },
                items: cart,
                subtotal: subtotal,
                shipping: shippingFee,
                total: subtotal + shippingFee
            };
            
            // local record ng order (per browser)
            const orders = JSON.parse(localStorage.getItem('rip_orders') || '[]');
            orders.push(order);
            localStorage.setItem('rip_orders', JSON.stringify(orders));
            
            // linisin ang cart
            saveCart([]);
            renderCheckoutSummary();
            
            showSuccess(order);
            
            if (isCod) {
                setTimeout(() => {
                    goToMessengerWithOrder(order);
                }, 900);
            }
        }
        
        // ======================
        // MESSENGER REDIRECT (dalawang tap)
        // ======================
        let messengerArmed = false;
        let currentOrderPayment = null;
        
        function resetMessengerButton() {
            const btn = document.getElementById('success-messenger-btn');
            if (!btn) return;
            messengerArmed = false;
            btn.textContent = 'Continue to Messenger';
            btn.classList.remove('armed');
        }
        
        function handleMessengerClick() {
            const btn = document.getElementById('success-messenger-btn');
            if (!btn) return;
            
            if (!messengerArmed) {
                messengerArmed = true;
                btn.textContent = 'Will be redirected to Messenger — tap again';
                btn.classList.add('armed');
                return;
            }
            
            const url = (CONFIG.messenger && CONFIG.messenger.url) || '#';
            window.open(url, '_blank');
        }
        
        // ======================
        // SUCCESS MODAL CLOSE + WARNING
        // ======================
        function closeSuccessModal(force = false) {
            const modal = document.getElementById('order-success');
            if (!modal) return;
            
            if (!force && currentOrderPayment !== 'cod') {
                showConfirmModal(
                    'You still need to message us your proof of payment via Messenger to confirm this order.',
                    'Leave anyway?',
                    () => {
                        // Fade out animation before navigation
                        document.body.classList.add('page-exit');
                        setTimeout(() => {
                            modal.classList.remove('active');
                            document.body.style.overflow = '';
                            window.location.href = 'store.html';
                        }, 400);
                    }
                );
                return;
            }
            
            // Fade out animation before navigation (for COD or direct close)
            document.body.classList.add('page-exit');
            setTimeout(() => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
                window.location.href = 'store.html';
            }, 400);
        }
        
        // ======================
        // CUSTOM CONFIRMATION MODAL
        // ======================
        function showConfirmModal(title, message, onConfirm) {
            const existing = document.getElementById('confirm-modal');
            if (existing) existing.remove();
            
            const confirmModal = document.createElement('div');
            confirmModal.id = 'confirm-modal';
            confirmModal.className = 'modal-overlay active';
            confirmModal.innerHTML = `
                <div class="modal confirm-modal">
                    <h3 class="confirm-title">${title}</h3>
                    <p class="confirm-message">${message}</p>
                    <div class="confirm-actions">
                        <button class="confirm-cancel" id="confirm-cancel">Cancel</button>
                        <button class="confirm-proceed" id="confirm-proceed">Leave</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(confirmModal);
            
            const cancelBtn = confirmModal.querySelector('#confirm-cancel');
            const proceedBtn = confirmModal.querySelector('#confirm-proceed');
            
            const closeConfirm = () => {
                confirmModal.remove();
            };
            
            cancelBtn.addEventListener('click', closeConfirm);
            proceedBtn.addEventListener('click', () => {
                closeConfirm();
                onConfirm();
            });
            
            confirmModal.addEventListener('click', (e) => {
                if (e.target === confirmModal) closeConfirm();
            });
        }
        
        function showSuccess(order) {
            document.getElementById('success-order-num').textContent = 'Order No. ' + order.number;
            document.getElementById('success-total').textContent =
            'Total: ' + formatPrice(order.total) + ' — ' + order.payment.toUpperCase();
            
            currentOrderPayment = order.payment;
            resetMessengerButton();
            
            const instructions = document.getElementById('success-instructions');
            const messengerBtn = document.getElementById('success-messenger-btn');
            
            if (order.payment === 'cod') {
                instructions.innerHTML =
                'We copied your order details and opened Messenger for you — just paste and send to confirm your same-day delivery.';
                if (messengerBtn) messengerBtn.style.display = 'none';
            } else {
                const method = CONFIG.payments.find(p => p.id === order.payment);
                instructions.innerHTML = `
            <img src="${method.qr}" alt="${method.label} QR" class="success-qr" />
            Send the exact amount via ${method.label}, then tap below to message us your proof of payment.`;
                if (messengerBtn) messengerBtn.style.display = '';
            }
            
            document.getElementById('order-success').classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        // ======================
        // PAYMENT SECTION - PLAIN TEXT ORDER 
        // ======================
        function buildOrderDetailsText(order) {
            const lines = [];
            lines.push('Order ' + order.number);
            lines.push('');
            order.items.forEach(item => {
                lines.push('- ' + item.name + ' (Size: ' + item.size + ') x' + item.qty + ' — ' + formatPrice(item.price * item.qty));
            });
            lines.push('');
            lines.push('Subtotal: ' + formatPrice(order.subtotal));
            lines.push('Payment: Same day delivery (Cash on delivery)');
            lines.push('Delivery: Same-day via Lalamove / Grab Express');
            lines.push('');
            lines.push('Name: ' + order.customer.firstName + ' ' + order.customer.lastName);
            lines.push('Address: ' + order.customer.address);
            lines.push('Phone: ' + order.customer.phone);
            return lines.join('\n');
        }
        
        function goToMessengerWithOrder(order) {
            const text = buildOrderDetailsText(order);
            const url = (CONFIG.messenger && CONFIG.messenger.url) || '#';
            
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).catch(() => {});
            }
            
            window.open(url, '_blank');
        }
        
        // ======================
        // INIT
        // ======================
        document.addEventListener('DOMContentLoaded', () => {
            if (!getCart().length) {
                sessionStorage.setItem('rip_notice', 'empty_cart');
                window.location.href = 'store.html';
                return;
            }
            
            renderCheckoutSummary();
            renderDeliveryInfo();
            renderPayments();
            
            const placeBtn = document.getElementById('co-place-order');
            if (placeBtn) placeBtn.addEventListener('click', placeOrder);
            
            const regionEl = document.getElementById('co-region');
            if (regionEl) regionEl.addEventListener('change', renderCheckoutSummary);
            
            // Messenger button
            const messengerBtn = document.getElementById('success-messenger-btn');
            if (messengerBtn) messengerBtn.addEventListener('click', handleMessengerClick);
            
            // Success modal — X button
            const successClose = document.getElementById('order-success-close');
            if (successClose) {
                successClose.addEventListener('click', () => closeSuccessModal());
            }
            
            // Success modal — Back to Shop button (also triggers confirmation)
            const successBackLink = document.getElementById('success-back-link') 
            || document.querySelector('.success-back-link')
            || document.querySelector('a.success-back')
            || document.querySelector('#order-success a[href="store.html"]');
            
            if (successBackLink) {
                successBackLink.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    closeSuccessModal(false);
                }, true); // capture phase — runs before page transition
            }
            
            // ESC key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    const successModal = document.getElementById('order-success');
                    if (successModal && successModal.classList.contains('active')) {
                        closeSuccessModal();
                    }
                }
            });
        });