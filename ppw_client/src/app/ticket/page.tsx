import { fetchTicket } from '@/features/ticket/api/fetch.tickets';
import TicketsPages from '@/features/ticket/components/Tickets';

export default async function ticketsPages() {
  const tickets = await fetchTicket();
  console.log(tickets);
  return <TicketsPages tickets={tickets} />;
}
