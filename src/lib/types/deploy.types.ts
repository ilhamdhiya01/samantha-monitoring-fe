// Event `container create` yang dicatat monitor (riwayat deploy).
export interface DeployEvent {
  id: string;
  container: string;
  // Referensi image saat dibuat ("goodenglish-be:test").
  image: string;
  occurredAt: string;
}
