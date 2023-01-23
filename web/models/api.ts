/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface EntitiesBillingUsage {
  /** @example "2022-06-05T14:26:02.302718+03:00" */
  created_at: string
  /** @example "2022-01-31T23:59:59+00:00" */
  end_timestamp: string
  /** @example "32343a19-da5e-4b1b-a767-3298a73703cb" */
  id: string
  /** @example 465 */
  received_messages: number
  /** @example 321 */
  sent_messages: number
  /** @example "2022-01-01T00:00:00+00:00" */
  start_timestamp: string
  /** @example 0 */
  total_cost: number
  /** @example "2022-06-05T14:26:10.303278+03:00" */
  updated_at: string
  /** @example "WB7DRDWrJZRGbYrv2CKGkqbzvqdC" */
  user_id: string
}

export interface EntitiesHeartbeat {
  /** @example "32343a19-da5e-4b1b-a767-3298a73703cb" */
  id: string
  /** @example "+18005550199" */
  owner: string
  /** @example "2022-06-05T14:26:01.520828+03:00" */
  timestamp: string
  /** @example "WB7DRDWrJZRGbYrv2CKGkqbzvqdC" */
  user_id: string
}

export interface EntitiesMessage {
  /** @example false */
  can_be_polled: boolean
  /** @example "+18005550100" */
  contact: string
  /** @example "This is a sample text message" */
  content: string
  /** @example "2022-06-05T14:26:02.302718+03:00" */
  created_at: string
  /** @example "2022-06-05T14:26:09.527976+03:00" */
  delivered_at: string
  /** @example "2022-06-05T14:26:09.527976+03:00" */
  expired_at: string
  /** @example "2022-06-05T14:26:09.527976+03:00" */
  failed_at: string
  /** @example "UNKNOWN" */
  failure_reason: string
  /** @example "32343a19-da5e-4b1b-a767-3298a73703cb" */
  id: string
  /** @example "2022-06-05T14:26:09.527976+03:00" */
  last_attempted_at: string
  /** @example 1 */
  max_send_attempts: number
  /** @example "2022-06-05T14:26:09.527976+03:00" */
  order_timestamp: string
  /** @example "+18005550199" */
  owner: string
  /** @example "2022-06-05T14:26:09.527976+03:00" */
  received_at: string
  /** @example "2022-06-05T14:26:01.520828+03:00" */
  request_received_at: string
  /** @example "2022-06-05T14:26:09.527976+03:00" */
  scheduled_at: string
  /** @example 0 */
  send_attempt_count: number
  /**
   * SendDuration is the number of nanoseconds from when the request was received until when the mobile phone send the message
   * @example 133414
   */
  send_time: number
  /** @example "2022-06-05T14:26:09.527976+03:00" */
  sent_at: string
  /** @example "pending" */
  status: string
  /** @example "mobile-terminated" */
  type: string
  /** @example "2022-06-05T14:26:10.303278+03:00" */
  updated_at: string
  /** @example "WB7DRDWrJZRGbYrv2CKGkqbzvqdC" */
  user_id: string
}

export interface EntitiesMessageThread {
  /** @example "indigo" */
  color: string
  /** @example "+18005550100" */
  contact: string
  /** @example "2022-06-05T14:26:09.527976+03:00" */
  created_at: string
  /** @example "32343a19-da5e-4b1b-a767-3298a73703ca" */
  id: string
  /** @example false */
  is_archived: boolean
  /** @example "This is a sample message content" */
  last_message_content: string
  /** @example "32343a19-da5e-4b1b-a767-3298a73703ca" */
  last_message_id: string
  /** @example "2022-06-05T14:26:09.527976+03:00" */
  order_timestamp: string
  /** @example "+18005550199" */
  owner: string
  /** @example "2022-06-05T14:26:09.527976+03:00" */
  updated_at: string
  /** @example "WB7DRDWrJZRGbYrv2CKGkqbzvqdC" */
  user_id: string
}

export interface EntitiesPhone {
  /** @example "2022-06-05T14:26:02.302718+03:00" */
  created_at: string
  /** @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzd....." */
  fcm_token: string
  /** @example "32343a19-da5e-4b1b-a767-3298a73703cb" */
  id: string
  /**
   * MaxSendAttempts determines how many times to retry sending an SMS message
   * @example 1
   */
  max_send_attempts: number
  /** MessageExpirationSeconds is the duration in seconds after sending a message when it is considered to be expired. */
  message_expiration_seconds: number
  /** @example 1 */
  messages_per_minute: number
  /** @example "+18005550199" */
  phone_number: string
  /** @example "2022-06-05T14:26:10.303278+03:00" */
  updated_at: string
  /** @example "WB7DRDWrJZRGbYrv2CKGkqbzvqdC" */
  user_id: string
}

export interface EntitiesUser {
  /** @example "32343a19-da5e-4b1b-a767-3298a73703cb" */
  active_phone_id: string
  /**
   * gorm:"uniqueIndex"
   * @example "xyz"
   */
  api_key: string
  /** @example "2022-06-05T14:26:02.302718+03:00" */
  created_at: string
  /**
   * gorm:"uniqueIndex"
   * @example "name@email.com"
   */
  email: string
  /** @example "WB7DRDWrJZRGbYrv2CKGkqbzvqdC" */
  id: string
  /** @example "2022-06-05T14:26:02.302718+03:00" */
  subscription_ends_at: string
  /** @example "8f9c71b8-b84e-4417-8408-a62274f65a08" */
  subscription_id: string
  /** @example "free" */
  subscription_name: string
  /** @example "2022-06-05T14:26:02.302718+03:00" */
  subscription_renews_at: string
  /** @example "on_trial" */
  subscription_status: string
  /** @example "2022-06-05T14:26:10.303278+03:00" */
  updated_at: string
}

export interface EntitiesWebhook {
  /** @example "2022-06-05T14:26:02.302718+03:00" */
  created_at: string
  /** @example ["[message.phone.received]"] */
  events: string[]
  /** @example "32343a19-da5e-4b1b-a767-3298a73703cb" */
  id: string
  /** @example "DGW8NwQp7mxKaSZ72Xq9v67SLqSbWQvckzzmK8D6rvd7NywSEkdMJtuxKyEkYnCY" */
  signing_key: string
  /** @example "2022-06-05T14:26:10.303278+03:00" */
  updated_at: string
  /** @example "https://example.com" */
  url: string
  /** @example "WB7DRDWrJZRGbYrv2CKGkqbzvqdC" */
  user_id: string
}

export interface RequestsHeartbeatStore {
  owner: string
}

export interface RequestsMessageEvent {
  /**
   * EventName is the type of event
   * * SENT: is emitted when a message is sent by the mobile phone
   * * FAILED: is event is emitted when the message could not be sent by the mobile phone
   * * DELIVERED: is event is emitted when a delivery report has been received by the mobile phone
   * @example "SENT"
   */
  event_name: string
  /** Reason is the exact error message in case the event is an error */
  reason: string
  /**
   * Timestamp is the time when the event was emitted, Please send the timestamp in UTC with as much precision as possible
   * @example "2022-06-05T14:26:09.527976+03:00"
   */
  timestamp: string
}

export interface RequestsMessageReceive {
  /** @example "This is a sample text message received on a phone" */
  content: string
  /** @example "+18005550199" */
  from: string
  /**
   * Timestamp is the time when the event was emitted, Please send the timestamp in UTC with as much precision as possible
   * @example "2022-06-05T14:26:09.527976+03:00"
   */
  timestamp: string
  /** @example "+18005550100" */
  to: string
}

export interface RequestsMessageSend {
  /** @example "This is a sample text message" */
  content: string
  /** @example "+18005550199" */
  from: string
  /** @example "+18005550100" */
  to: string
}

export interface RequestsMessageThreadUpdate {
  /** @example true */
  is_archived: boolean
}

export interface RequestsPhoneUpsert {
  /** @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzd....." */
  fcm_token: string
  /**
   * MaxSendAttempts is the number of attempts when sending an SMS message to handle the case where the phone is offline.
   * @example 2
   */
  max_send_attempts: number
  /**
   * MessageExpirationSeconds is the duration in seconds after sending a message when it is considered to be expired.
   * @example 12345
   */
  message_expiration_seconds: number
  /** @example 1 */
  messages_per_minute: number
  /** @example "+18005550199" */
  phone_number: string
}

export interface RequestsUserUpdate {
  /** @example "32343a19-da5e-4b1b-a767-3298a73703cb" */
  active_phone_id: string
}

export interface RequestsWebhookStore {
  events: string[]
  signing_key: string
  url: string
}

export interface RequestsWebhookUpdate {
  events: string[]
  signing_key: string
  url: string
}

export interface ResponsesBadRequest {
  /** @example "The request body is not a valid JSON string" */
  data: string
  /** @example "The request isn't properly formed" */
  message: string
  /** @example "error" */
  status: string
}

export interface ResponsesBillingUsageResponse {
  data: EntitiesBillingUsage
  /** @example "item created successfully" */
  message: string
  /** @example "success" */
  status: string
}

export interface ResponsesBillingUsagesResponse {
  data: EntitiesBillingUsage[]
  /** @example "item created successfully" */
  message: string
  /** @example "success" */
  status: string
}

export interface ResponsesHeartbeatResponse {
  data: EntitiesHeartbeat
  /** @example "item created successfully" */
  message: string
  /** @example "success" */
  status: string
}

export interface ResponsesHeartbeatsResponse {
  data: EntitiesHeartbeat[]
  /** @example "item created successfully" */
  message: string
  /** @example "success" */
  status: string
}

export interface ResponsesInternalServerError {
  /** @example "We ran into an internal error while handling the request." */
  message: string
  /** @example "error" */
  status: string
}

export interface ResponsesMessageResponse {
  data: EntitiesMessage
  /** @example "item created successfully" */
  message: string
  /** @example "success" */
  status: string
}

export interface ResponsesMessageThreadsResponse {
  data: EntitiesMessageThread[]
  /** @example "item created successfully" */
  message: string
  /** @example "success" */
  status: string
}

export interface ResponsesMessagesResponse {
  data: EntitiesMessage[]
  /** @example "item created successfully" */
  message: string
  /** @example "success" */
  status: string
}

export interface ResponsesNoContent {
  /** @example "phone deleted successfully" */
  message: string
  /** @example "success" */
  status: string
}

export interface ResponsesNotFound {
  /** @example "cannot find message with ID [32343a19-da5e-4b1b-a767-3298a73703ca]" */
  message: string
  /** @example "error" */
  status: string
}

export interface ResponsesOkString {
  data: string
  /** @example "Request handled successfully" */
  message: string
  /** @example "success" */
  status: string
}

export interface ResponsesPhoneResponse {
  data: EntitiesPhone
  /** @example "item created successfully" */
  message: string
  /** @example "success" */
  status: string
}

export interface ResponsesPhonesResponse {
  data: EntitiesPhone[]
  /** @example "item created successfully" */
  message: string
  /** @example "success" */
  status: string
}

export interface ResponsesUnauthorized {
  /** @example "Make sure your API key is set in the [X-API-Key] header in the request" */
  data: string
  /** @example "You are not authorized to carry out this request." */
  message: string
  /** @example "error" */
  status: string
}

export interface ResponsesUnprocessableEntity {
  data: Record<string, string[]>
  /** @example "validation errors while sending message" */
  message: string
  /** @example "error" */
  status: string
}

export interface ResponsesUserResponse {
  data: EntitiesUser
  /** @example "item created successfully" */
  message: string
  /** @example "success" */
  status: string
}

export interface ResponsesWebhookResponse {
  data: EntitiesWebhook
  /** @example "item created successfully" */
  message: string
  /** @example "success" */
  status: string
}

export interface ResponsesWebhooksResponse {
  data: EntitiesWebhook[]
  /** @example "item created successfully" */
  message: string
  /** @example "success" */
  status: string
}