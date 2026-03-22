import { SendHorizontal } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

const ChatBox = ({
  contacts,
  selectedContact,
  onSelectContact,
  messages,
  value,
  onChange,
  onSend,
  currentUserId
}) => {
  const { t } = useLanguage();

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_1fr] lg:gap-6">
      <div className="glass-panel p-4">
        <h3 className="section-title">{t("contacts")}</h3>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-2 lg:overflow-visible lg:pb-0">
          {contacts.map((contact) => (
            <button
              key={contact._id}
              onClick={() => onSelectContact(contact)}
              className={`min-w-[220px] rounded-2xl px-4 py-3 text-left transition lg:w-full lg:min-w-0 ${
                selectedContact?._id === contact._id
                  ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                  : "bg-slate-50 text-slate-900 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p
                  className={`font-semibold ${
                    selectedContact?._id === contact._id ? "text-white" : "text-slate-900 dark:text-slate-100"
                  }`}
                >
                  {contact.name}
                </p>
                {contact.unreadCount ? (
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      selectedContact?._id === contact._id
                        ? "bg-white/20 text-white"
                        : "bg-emerald-500 text-white"
                    }`}
                  >
                    +{contact.unreadCount}
                  </span>
                ) : null}
              </div>
              <p
                className={`mt-1 text-xs ${
                  selectedContact?._id === contact._id ? "text-white/90" : "text-slate-500 dark:text-slate-300"
                }`}
              >
                {contact.email}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel flex min-h-[420px] flex-col lg:min-h-[520px]">
        <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h3 className="section-title">{selectedContact?.name || t("pickContact")}</h3>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
          {messages.map((message) => {
            const ownMessage = (message.sender?._id || message.sender) === currentUserId;

            return (
              <div
                key={message._id}
                className={`flex ${ownMessage ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm sm:max-w-md ${
                    ownMessage
                      ? "bg-slate-900 text-white dark:bg-brand-500"
                      : "bg-brand-50 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                  }`}
                >
                  {message.message}
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={onSend} className="flex gap-2 border-t border-slate-200 p-3 dark:border-slate-800 sm:gap-3 sm:p-4">
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={t("typeMessage")}
            className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 caret-slate-900 outline-none ring-brand-500 transition placeholder:text-slate-400 focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:caret-slate-100 dark:placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="rounded-2xl bg-brand-500 px-3 py-3 text-white transition hover:bg-brand-700 sm:px-4"
          >
            <SendHorizontal size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
