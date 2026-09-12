export enum GlobalRole {
  ADMIN = 'ADMIN',
  SUPPORT = 'SUPPORT',
  OWNER = 'GLOBAL_OWNER',
  CONSUMER = 'CONSUMER',
  COURIER = 'COURIER',
  GUEST = 'GUEST',
}

export enum TenantRole {
  OWNER = 'TENANT_OWNER',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF',
}

export enum TenantStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
}

export enum TenantType {
  RESTAURANT = 'RESTAURANT',
  FOOD_TRUCK = 'FOOD_TRUCK',
  DARK_KITCHEN = 'DARK_KITCHEN',
  FRANCHISE = 'FRANCHISE',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PIX = 'PIX',
  CASH = 'CASH',
  VOUCHER = 'VOUCHER',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}

export enum LoyaltyTransactionType {
  EARN = 'EARN',
  REDEEM = 'REDEEM',
  EXPIRE = 'EXPIRE',
  ADJUST = 'ADJUST',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  TRIAL = 'TRIAL',
  CANCELLED = 'CANCELLED',
  PAST_DUE = 'PAST_DUE',
}

export enum PlanType {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum Plan {
  STARTER = 'starter',
  PRO = 'pro',
  BUSINESS = 'business',
  REDE = 'rede',
}

export enum NotificationType {
  SYSTEM = 'SYSTEM',
  PROMOTION = 'PROMOTION',
  ORDER = 'ORDER',
  PAYMENT = 'PAYMENT',
  USER = 'USER',
}

export enum InvoiceStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export enum OrderChannel {
  DELIVERY = 'DELIVERY',
  PICKUP = 'PICKUP',
  COUNTER = 'COUNTER',
  TABLE_TAB = 'TABLE_TAB',
}
