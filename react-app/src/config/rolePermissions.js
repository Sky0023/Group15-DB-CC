import { MANAGE_USERS, SECURITIES, TRADES } from "./routeUrls";

export const ADMIN_ALLOWED_ROUTES = [MANAGE_USERS, SECURITIES];

export const OPS_TEAM_USER_ALLOWED_ROUTES = [SECURITIES, TRADES];

export const COUNTERPARTY_ALLOWED_ROUTES = [TRADES, SECURITIES];
