import * as React from "react";
/**
 * Email-safe, table-based notification template.
 * Use ReactDOMServer.renderToStaticMarkup(<NotificationEmail {...props} />)
 * to produce an HTML string for sending via your email provider.
 */
export default function NotificationEmail({
  recipientName,
  subject = "Notification",
  message,
  caseNumber,
  date,
  time,
  location,
  ctaUrl,
  ctaText = "View details",
  supportEmail = "support@legal-aid.local",
  logoUrl,
}: {
  recipientName?: string;
  subject?: string;
  message: string;
  caseNumber?: string;
  date?: string; // human friendly date string
  time?: string;
  location?: string;
  ctaUrl?: string;
  ctaText?: string;
  supportEmail?: string;
  logoUrl?: string;
}) {
  const accent = "#2563eb"; // blue-600
  const muted = "#6b7280"; // gray-500

  return (
    <table
      width="100%"
      cellPadding={0}
      cellSpacing={0}
      role="presentation"
      style={{
        fontFamily:
          "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        backgroundColor: "transparent",
      }}
    >
      <tbody>
        <tr>
          <td align="center" style={{ padding: "24px" }}>
            <table
              width="700"
              cellPadding={0}
              cellSpacing={0}
              role="presentation"
              style={{
                maxWidth: 700,
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: 0,
                background: "#ffffff",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 6px 30px rgba(16,24,40,0.08)",
              }}
            >
              {/* Header */}
              <tbody>
                <tr>
                  <td
                    style={{
                      padding: "20px 28px",
                      borderBottom: "1px solid #eef2ff",
                      background: "#ffffff",
                    }}
                  >
                    <table width="100%" role="presentation">
                      <tbody>
                        <tr>
                          <td style={{ verticalAlign: "middle" }}>
                            {logoUrl ? (
                              <img
                                src={logoUrl}
                                alt="logo"
                                width={140}
                                style={{ display: "block", border: 0 }}
                              />
                            ) : (
                              <div
                                style={{
                                  display: "inline-block",
                                  padding: "6px 12px",
                                  borderRadius: 8,
                                  background: accent,
                                  color: "#fff",
                                  fontWeight: 700,
                                }}
                              >
                                L-A
                              </div>
                            )}
                          </td>
                          <td
                            style={{
                              textAlign: "right",
                              verticalAlign: "middle",
                              color: muted,
                              fontSize: 13,
                            }}
                          >
                            {subject}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                {/* Hero */}
                <tr>
                  <td style={{ padding: "28px", background: "#ffffff" }}>
                    <h1
                      style={{
                        margin: 0,
                        fontSize: 20,
                        lineHeight: "28px",
                        color: "#0f172a",
                      }}
                    >
                      Hi {recipientName},
                    </h1>

                    <p
                      style={{
                        marginTop: 12,
                        marginBottom: 20,
                        color: muted,
                        fontSize: 15,
                        lineHeight: "22px",
                      }}
                    >
                      {message}
                    </p>

                    {/* Case / details card */}
                    {(caseNumber || date || time || location) && (
                      <table
                        role="presentation"
                        cellPadding={0}
                        cellSpacing={0}
                        style={{
                          width: "100%",
                          borderRadius: 8,
                          border: "1px solid #eef2ff",
                          background: "#fbfbff",
                        }}
                      >
                        <tbody>
                          <tr>
                            <td style={{ padding: 14 }}>
                              {caseNumber && (
                                <div
                                  style={{
                                    fontSize: 13,
                                    color: "#334155",
                                    fontWeight: 600,
                                  }}
                                >
                                  Case: {caseNumber}
                                </div>
                              )}
                              <div
                                style={{
                                  marginTop: 8,
                                  fontSize: 13,
                                  color: muted,
                                }}
                              >
                                {date && (
                                  <div>
                                    <strong
                                      style={{
                                        color: "#0f172a",
                                        fontWeight: 600,
                                      }}
                                    >
                                      Date:
                                    </strong>{" "}
                                    {date}
                                  </div>
                                )}
                                {time && (
                                  <div>
                                    <strong
                                      style={{
                                        color: "#0f172a",
                                        fontWeight: 600,
                                      }}
                                    >
                                      Time:
                                    </strong>{" "}
                                    {time}
                                  </div>
                                )}
                                {location && (
                                  <div>
                                    <strong
                                      style={{
                                        color: "#0f172a",
                                        fontWeight: 600,
                                      }}
                                    >
                                      Location:
                                    </strong>{" "}
                                    {location}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    )}

                    {/* CTA */}
                    {ctaUrl && (
                      <div style={{ marginTop: 22 }}>
                        <a
                          href={ctaUrl}
                          style={{
                            display: "inline-block",
                            background: accent,
                            color: "#fff",
                            textDecoration: "none",
                            padding: "10px 18px",
                            borderRadius: 8,
                            fontWeight: 600,
                            fontSize: 15,
                            boxShadow: "0 6px 18px rgba(37,99,235,0.16)",
                          }}
                        >
                          {ctaText}
                        </a>
                      </div>
                    )}

                    <p style={{ marginTop: 20, color: muted, fontSize: 13 }}>
                      If you have questions, reply to this email or contact{" "}
                      <a
                        href={`mailto:${supportEmail}`}
                        style={{ color: accent, textDecoration: "none" }}
                      >
                        {supportEmail}
                      </a>
                      .
                    </p>
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td
                    style={{
                      padding: "18px 28px",
                      background: "#fafafa",
                      borderTop: "1px solid #eef2ff",
                    }}
                  >
                    <table width="100%" role="presentation">
                      <tbody>
                        <tr>
                          <td style={{ color: "#94a3b8", fontSize: 13 }}>
                            © {new Date().getFullYear()} Legal Aid Platform —
                            Trusted access to justice
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <a
                              href="#"
                              style={{
                                color: muted,
                                fontSize: 12,
                                textDecoration: "none",
                              }}
                            >
                              Manage preferences
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            {/* small spacer */}
            <div style={{ height: 12 }} />
          </td>
        </tr>
      </tbody>
    </table>
  );
}
